import {
    ArrowUp,
    Check,
    Hash,
    LoaderCircle,
    RotateCcw,
    Sparkles,
    Users,
    Wifi,
    WifiOff,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from "react";

import { useOutletContext, useParams } from "react-router-dom";

import { fetchMessageHistory, spot } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { type Visibility } from "../../types/room";

type SpotData = {
    id: number;
    title: string;
};

type RoomData = {
    id: number;
    spots: SpotData[];
    name: string;
    visibility: Visibility;
};

type SpotContentContext = {
    roomData: RoomData | null;
};

type MessageStatus = "sending" | "sent" | "failed";

type ConnectionStatus =
    | "connecting"
    | "connected"
    | "disconnected";

type ChatMessage = {
    id: string;
    text: string;
    createdAt: string;
    status: MessageStatus;
    author: {
        id: string;
        name: string;
    };
};

type HistoryMessage = {
    id?: number | string;
    user: string | null;
    content: string;
    timestamp: string;
    status?: MessageStatus;
};

type IncomingSocketMessage = {
    message?: unknown;
    sender?: unknown;
    timestamp?: unknown;
};

const CURRENT_USER_ID = "current-user";

const CURRENT_USER = {
    id: CURRENT_USER_ID,
    name: "You",
};

function formatTime(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isValidDate(dateString: string) {
    return !Number.isNaN(new Date(dateString).getTime());
}

function getMessageDateLabel(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    const sameDay = (first: Date, second: Date) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();

    if (sameDay(date, today)) return "Today";
    if (sameDay(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString([], {
        day: "numeric",
        month: "long",
        year:
            date.getFullYear() === today.getFullYear()
                ? undefined
                : "numeric",
    });
}

function SpotContent() {
    const { room_id, title } = useParams();
    const { roomData } = useOutletContext<SpotContentContext>();
    const { user } = useAuth();

    const [spotData, setSpotData] = useState<SpotData | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>("disconnected");

    const [loadAttempt, setLoadAttempt] = useState(0);

    const socketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const shouldAutoScrollRef = useRef(true);

    const userEmail = user?.email ?? "";

    // Load the selected Spot and its message history.
    useEffect(() => {
        let cancelled = false;

        async function loadConversation() {
            setIsLoading(true);
            setLoadError(null);
            setSpotData(null);
            setMessages([]);
            setConnectionStatus("disconnected");

            try {
                if (!room_id || !title) {
                    throw new Error("Missing room or Spot identifier.");
                }

                const spotDetails = await spot(room_id, title);

                if (cancelled) return;

                const history = (await fetchMessageHistory(
                    spotDetails.id
                )) as HistoryMessage[];

                if (cancelled) return;

                const formattedHistory: ChatMessage[] = history.map(
                    (item, index) => {
                        const isMine =
                            item.user === userEmail ||
                            item.user === "You";

                        const createdAt =
                            typeof item.timestamp === "string" &&
                            isValidDate(item.timestamp)
                                ? item.timestamp
                                : new Date().toISOString();

                        return {
                            // Prefer a backend ID when one is available.
                            // Otherwise, create a stable-enough key for this
                            // particular history response.
                            id:
                                item.id != null
                                    ? `history-${item.id}`
                                    : `history-${spotDetails.id}-${index}-${createdAt}`,
                            text: item.content,
                            createdAt,
                            status: "sent",
                            author: {
                                id: isMine
                                    ? CURRENT_USER_ID
                                    : item.user ?? "unknown-user",
                                name: isMine
                                    ? "You"
                                    : item.user ?? "Unknown user",
                            },
                        };
                    }
                );

                setSpotData(spotDetails);
                setMessages(formattedHistory);
                shouldAutoScrollRef.current = true;
            } catch (error) {
                if (cancelled) return;

                console.error("Failed to load Spot conversation:", error);

                setLoadError(
                    "We couldn't load this conversation. Check your connection and try again."
                );
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void loadConversation();

        return () => {
            cancelled = true;
        };
    }, [room_id, title, userEmail, loadAttempt]);

    // Connect to the current Spot's WebSocket.
    useEffect(() => {
        if (!spotData?.id) return;

        const token = localStorage.getItem("access_token");

        if (!token) {
            console.error("No JWT access token found in localStorage.");
            setConnectionStatus("disconnected");
            return;
        }

        let active = true;
        let socket: WebSocket;

        setConnectionStatus("connecting");

        try {
            const url = new URL(
                `ws://localhost:8000/ws/chat/spot/${spotData.id}/`
            );

            url.searchParams.set("token", token);

            socket = new WebSocket(url.toString());
            socketRef.current = socket;
        } catch (error) {
            console.error("Could not create WebSocket:", error);
            setConnectionStatus("disconnected");
            return;
        }

        socket.onopen = () => {
            if (!active) return;

            console.log(`Connected to Spot ${spotData.id}`);
            setConnectionStatus("connected");
        };

        socket.onmessage = (event: MessageEvent<string>) => {
            if (!active) return;

            let data: IncomingSocketMessage;

            try {
                data = JSON.parse(event.data) as IncomingSocketMessage;
            } catch (error) {
                console.error("Received invalid WebSocket JSON:", error);
                return;
            }

            if (typeof data.message !== "string") {
                console.warn("Ignoring message with an invalid payload.");
                return;
            }

            const sender =
                typeof data.sender === "string"
                    ? data.sender
                    : "Collaborator";

            const isMine =
                sender === userEmail || sender === "You";

            const createdAt =
                typeof data.timestamp === "string" &&
                isValidDate(data.timestamp)
                    ? data.timestamp
                    : new Date().toISOString();

            // The current backend doesn't provide a shared client message ID.
            // Match the oldest pending message with the same text when the
            // server broadcasts our own message back to us.
            if (isMine) {
                let matchedPendingMessage = false;

                setMessages((previous) => {
                    const pendingIndex = previous.findIndex(
                        (item) =>
                            item.status === "sending" &&
                            item.author.id === CURRENT_USER_ID &&
                            item.text === data.message
                    );

                    if (pendingIndex === -1) {
                        return [
                            ...previous,
                            {
                                id: crypto.randomUUID(),
                                text: data.message as string,
                                createdAt,
                                status: "sent",
                                author: CURRENT_USER,
                            },
                        ];
                    }

                    matchedPendingMessage = true;

                    return previous.map((item, index) =>
                        index === pendingIndex
                            ? {
                                  ...item,
                                  status: "sent",
                                  createdAt,
                              }
                            : item
                    );
                });

                // A matching optimistic message is already in the list.
                // No extra message needs to be added.
                void matchedPendingMessage;
                return;
            }

            const incomingMessage: ChatMessage = {
                id: crypto.randomUUID(),
                text: data.message,
                createdAt,
                status: "sent",
                author: {
                    id: sender,
                    name: sender,
                },
            };

            setMessages((previous) => [
                ...previous,
                incomingMessage,
            ]);
        };

        socket.onerror = (event) => {
            if (!active) return;

            console.error("WebSocket error:", event);
        };

        socket.onclose = (event) => {
            if (!active) return;

            console.log(
                `WebSocket disconnected. Code: ${event.code}`
            );

            setConnectionStatus("disconnected");
        };

        return () => {
            active = false;

            socket.onopen = null;
            socket.onmessage = null;
            socket.onerror = null;
            socket.onclose = null;

            if (socketRef.current === socket) {
                socketRef.current = null;
            }

            if (
                socket.readyState === WebSocket.OPEN ||
                socket.readyState === WebSocket.CONNECTING
            ) {
                socket.close();
            }
        };
    }, [spotData?.id, userEmail]);

    // Scroll to the bottom when appropriate, but don't pull users away
    // from older messages when they're reading the conversation.
    useEffect(() => {
        if (!shouldAutoScrollRef.current) return;

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, isLoading]);

    const handleMessagesScroll = useCallback(() => {
        const container = messagesContainerRef.current;

        if (!container) return;

        const distanceFromBottom =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;

        shouldAutoScrollRef.current = distanceFromBottom < 120;
    }, []);

    function resizeComposer() {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(
            textarea.scrollHeight,
            128
        )}px`;
    }

    function handleMessageChange(value: string) {
        setMessage(value);
        requestAnimationFrame(resizeComposer);
    }

    function sendMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const text = message.trim();
        const socket = socketRef.current;

        if (
            !text ||
            !spotData ||
            !socket ||
            socket.readyState !== WebSocket.OPEN
        ) {
            return;
        }

        const temporaryId = crypto.randomUUID();

        const optimisticMessage: ChatMessage = {
            id: temporaryId,
            text,
            createdAt: new Date().toISOString(),
            status: "sending",
            author: CURRENT_USER,
        };

        shouldAutoScrollRef.current = true;

        setMessages((previous) => [
            ...previous,
            optimisticMessage,
        ]);

        setMessage("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        try {
            // Keep the existing backend payload unchanged.
            socket.send(JSON.stringify({ message: text }));
        } catch (error) {
            console.error("Failed to send WebSocket message:", error);

            setMessages((previous) =>
                previous.map((item) =>
                    item.id === temporaryId
                        ? { ...item, status: "failed" }
                        : item
                )
            );
        }
    }

    function retryMessage(id: string) {
        const target = messages.find((item) => item.id === id);
        const socket = socketRef.current;

        if (
            !target ||
            target.status !== "failed" ||
            !socket ||
            socket.readyState !== WebSocket.OPEN
        ) {
            return;
        }

        setMessages((previous) =>
            previous.map((item) =>
                item.id === id
                    ? { ...item, status: "sending" }
                    : item
            )
        );

        try {
            // Reuse the existing payload contract.
            socket.send(JSON.stringify({ message: target.text }));
        } catch (error) {
            console.error("Failed to retry message:", error);

            setMessages((previous) =>
                previous.map((item) =>
                    item.id === id
                        ? { ...item, status: "failed" }
                        : item
                )
            );
        }
    }

    function handleComposerKeyDown(
        event: KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
        }
    }

    const canSend =
        Boolean(message.trim()) &&
        !isLoading &&
        Boolean(spotData) &&
        connectionStatus === "connected";

    return (
        <main
            id="general"
            className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#090d1d] text-white"
        >
            {/* Ambient workspace lighting */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/[0.07] blur-[100px]"
            />

            {/* Header */}
            <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.06] px-4 py-4 sm:px-7">
                <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                        <Hash size={12} />
                        <span>Current Spot</span>
                    </div>

                    <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                        {spotData?.title ?? title ?? "Loading Spot..."}
                    </h1>

                    {roomData?.name && (
                        <p className="mt-1 truncate text-xs text-white/40">
                            {roomData.name}
                        </p>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <div
                        className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2"
                        aria-live="polite"
                    >
                        {connectionStatus === "connected" ? (
                            <Wifi
                                size={14}
                                className="text-emerald-300"
                            />
                        ) : connectionStatus === "connecting" ? (
                            <LoaderCircle
                                size={14}
                                className="animate-spin text-amber-300"
                            />
                        ) : (
                            <WifiOff
                                size={14}
                                className="text-amber-300"
                            />
                        )}

                        <span className="hidden text-xs text-white/65 sm:inline">
                            {connectionStatus === "connected"
                                ? "Connected"
                                : connectionStatus === "connecting"
                                  ? "Connecting"
                                  : "Disconnected"}
                        </span>
                    </div>

                    <div className="hidden items-center gap-2 text-white/45 sm:flex">
                        <Users size={15} />
                        <span className="text-xs">Your team</span>
                    </div>
                </div>
            </header>

            {/* Conversation */}
            <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <div
                    ref={messagesContainerRef}
                    onScroll={handleMessagesScroll}
                    className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-8"
                    role="log"
                    aria-label="Chat messages"
                    aria-live="polite"
                    aria-relevant="additions text"
                >
                    <div className="mx-auto flex w-full max-w-3xl flex-col">
                        {isLoading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-white/50">
                                <LoaderCircle
                                    size={26}
                                    className="animate-spin text-indigo-300"
                                />
                                <p className="text-sm">
                                    Loading your conversation...
                                </p>

                                <div className="w-full max-w-md space-y-4 pt-4">
                                    <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-white/[0.04]" />
                                    <div className="ml-auto h-16 w-2/3 animate-pulse rounded-2xl bg-indigo-400/[0.08]" />
                                    <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-white/[0.04]" />
                                </div>
                            </div>
                        ) : loadError ? (
                            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-300/15 bg-rose-400/[0.07]">
                                    <WifiOff
                                        size={22}
                                        className="text-rose-300"
                                    />
                                </div>

                                <h2 className="text-base font-semibold">
                                    Conversation unavailable
                                </h2>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-white/45">
                                    {loadError}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setLoadAttempt((count) => count + 1)
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                                >
                                    <RotateCcw size={14} />
                                    Try again
                                </button>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex min-h-64 flex-1 flex-col items-center justify-center py-12 text-center">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-indigo-300/20 bg-gradient-to-br from-indigo-400/[0.17] via-violet-500/[0.10] to-white/[0.03] shadow-[0_0_50px_-12px_rgba(99,102,241,0.3),inset_0_1px_0_rgba(255,255,255,0.12)]">
                                    <Sparkles
                                        size={27}
                                        className="text-indigo-200"
                                    />
                                </div>

                                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-indigo-300/75">
                                    YOUR SPACE TO CREATE
                                </p>

                                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                                    {roomData?.name ?? "Your workspace"}
                                </h2>

                                <p className="mt-4 max-w-sm text-sm leading-7 text-white/45 sm:text-base">
                                    Share ideas, explore possibilities, and
                                    build something remarkable together.
                                </p>

                                <div className="mt-8 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 py-2 text-xs text-white/45">
                                    Start the conversation
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">
                                {messages.map((item, index) => {
                                    const isMine =
                                        item.author.id === CURRENT_USER_ID;

                                    const previousMessage =
                                        messages[index - 1];

                                    const showDateDivider =
                                        !previousMessage ||
                                        new Date(
                                            previousMessage.createdAt
                                        ).toDateString() !==
                                            new Date(
                                                item.createdAt
                                            ).toDateString();

                                    const isGrouped =
                                        previousMessage &&
                                        previousMessage.author.id ===
                                            item.author.id &&
                                        new Date(
                                            previousMessage.createdAt
                                        ).toDateString() ===
                                            new Date(
                                                item.createdAt
                                            ).toDateString() &&
                                        new Date(
                                            item.createdAt
                                        ).getTime() -
                                            new Date(
                                                previousMessage.createdAt
                                            ).getTime() <
                                            2 * 60 * 1000;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-3"
                                        >
                                            {showDateDivider && (
                                                <div className="flex items-center gap-3 py-2">
                                                    <div className="h-px flex-1 bg-white/[0.07]" />
                                                    <span className="text-[10px] font-medium text-white/35">
                                                        {getMessageDateLabel(
                                                            item.createdAt
                                                        )}
                                                    </span>
                                                    <div className="h-px flex-1 bg-white/[0.07]" />
                                                </div>
                                            )}

                                            <article
                                                className={`flex items-start gap-3 ${
                                                    isMine
                                                        ? "flex-row-reverse"
                                                        : ""
                                                }`}
                                            >
                                                {!isMine &&
                                                    (isGrouped ? (
                                                        <div className="w-9 shrink-0" />
                                                    ) : (
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold text-white/70">
                                                            {item.author.name
                                                                .slice(0, 1)
                                                                .toUpperCase()}
                                                        </div>
                                                    ))}

                                                <div
                                                    className={`flex min-w-0 max-w-[88%] flex-col sm:max-w-[75%] ${
                                                        isMine
                                                            ? "items-end"
                                                            : "items-start"
                                                    }`}
                                                >
                                                    {!isGrouped && (
                                                        <div className="mb-1.5 flex items-center gap-2 px-1">
                                                            <span className="text-xs font-medium text-white/65">
                                                                {item.author.name}
                                                            </span>

                                                            <span className="text-[10px] text-white/30">
                                                                {formatTime(
                                                                    item.createdAt
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                                            isMine
                                                                ? "rounded-tr-md border border-indigo-300/15 bg-gradient-to-br from-indigo-500/25 to-violet-500/20 text-white shadow-[0_6px_25px_-15px_rgba(99,102,241,0.5)]"
                                                                : "rounded-tl-md border border-white/[0.08] bg-white/[0.045] text-white/85"
                                                        }`}
                                                    >
                                                        <p className="whitespace-pre-wrap break-words">
                                                            {item.text}
                                                        </p>
                                                    </div>

                                                    {isMine && (
                                                        <div className="mt-1.5 flex items-center gap-1 px-1 text-[10px]">
                                                            {item.status ===
                                                                "sending" && (
                                                                <span className="text-white/35">
                                                                    <LoaderCircle
                                                                        size={11}
                                                                        className="mr-1 inline animate-spin"
                                                                    />
                                                                    Awaiting confirmation
                                                                </span>
                                                            )}

                                                            {item.status ===
                                                                "sent" && (
                                                                <span className="text-indigo-300/70">
                                                                    <Check
                                                                        size={12}
                                                                        className="inline"
                                                                    />{" "}
                                                                    Sent
                                                                </span>
                                                            )}

                                                            {item.status ===
                                                                "failed" && (
                                                                <>
                                                                    <span className="text-rose-300">
                                                                        Not sent
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            retryMessage(
                                                                                item.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            connectionStatus !==
                                                                            "connected"
                                                                        }
                                                                        className="ml-1 inline-flex items-center gap-1 text-indigo-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                                                    >
                                                                        <RotateCcw
                                                                            size={
                                                                                11
                                                                            }
                                                                        />
                                                                        Retry
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        </div>
                                    );
                                })}

                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </section>

            {/* Composer */}
            <footer className="relative z-10 shrink-0 px-3 pb-3 pt-2 sm:px-7 sm:pb-5">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-indigo-950/20 to-transparent" />

                <form
                    onSubmit={sendMessage}
                    className="relative mx-auto w-full max-w-3xl"
                >
                    <div className="group relative rounded-2xl border border-white/[0.13] bg-[#0d122b]/75 p-2 shadow-[0_12px_45px_-18px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-2xl transition duration-300 focus-within:border-indigo-400/40 focus-within:shadow-[0_0_0_1px_rgba(129,140,248,0.08),0_12px_45px_-18px_rgba(0,0,0,0.8)]">
                        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300/25 to-transparent" />

                        <div className="flex items-end gap-2">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={message}
                                onChange={(event) =>
                                    handleMessageChange(event.target.value)
                                }
                                onKeyDown={handleComposerKeyDown}
                                placeholder={
                                    connectionStatus === "connected"
                                        ? "Message your collaborators..."
                                        : "Waiting for connection..."
                                }
                                aria-label="Write a message"
                                disabled={
                                    isLoading ||
                                    !spotData ||
                                    connectionStatus !== "connected"
                                }
                                className="max-h-32 min-h-12 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed"
                            />

                            <button
                                type="submit"
                                aria-label="Send message"
                                title="Send message"
                                disabled={!canSend}
                                className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_4px_20px_-5px_rgba(99,102,241,0.65)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                            >
                                <ArrowUp size={19} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>

                    <p className="mt-3 hidden text-center text-[10px] text-white/25 sm:block">
                        Enter to send · Shift + Enter for a new line
                    </p>
                </form>
            </footer>
        </main>
    );
}

export default SpotContent;
