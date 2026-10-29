import React, { useId } from "react";


const Brain = ({ x, y, glow, node }: { x: number; y: number; glow: string; node: string }) => {
    // one hemisphere, mirrored for the other side so they match exactly
    const Hemisphere = () => (
        <>
            <path d="M-0.9 -5.2 C-2.4 -6.8 -6.4 -6.2 -6.6 -3 C-8.2 -2 -8.2 2 -6.6 3 C-6.4 6.2 -2.4 6.8 -0.9 5.2 Z" />
            <g strokeWidth="0.8" opacity="0.7">
                <path d="M-4.4 -2.8 C-3.4 -1.8 -4.4 -0.4 -3.4 0.8" />
                <path d="M-3 2.4 C-3.8 3.1 -3.6 3.8 -3 4" />
            </g>
        </>
    );

    return (
        <g transform={`translate(${x} ${y})`}>
            {/* soft halo */}
            <circle r="12" fill={`url(#${node})`} />
            {/* node backing */}
            <circle r="9.5" className="fill-surface stroke-accent/50" strokeWidth="1" />
            <g
                className="stroke-accent"
                fill="none"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#${glow})`}
            >
                <Hemisphere />
                <g transform="scale(-1 1)">
                    <Hemisphere />
                </g>
            </g>
        </g>
    );
};

// one curved spoke + its data packet, rotated into place around the hub
const Spoke = ({
    angle,
    delay,
    link,
    glow,
}: {
    angle: number;
    delay: number;
    link: string;
    glow: string;
}) => {
    const d = "M32 32 Q25 18 11 11";
    return (
        <g transform={`rotate(${angle} 32 32)`}>
            <path d={d} stroke={`url(#${link})`} strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <circle r="1.4" fill="currentColor" filter={`url(#${glow})`} className="motion-reduce:hidden">
                <animateMotion path={d} dur="2.8s" begin={`${delay}s`} repeatCount="indefinite" />
                <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.8;1"
                    dur="2.8s"
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                />
            </circle>
        </g>
    );
};

const Logo = () => {
    const uid = useId().replace(/:/g, "");
    const glow = `${uid}-glow`;
    const glowStrong = `${uid}-glow-strong`;
    const link = `${uid}-link`;
    const hub = `${uid}-hub`;
    const metal = `${uid}-metal`;
    const node = `${uid}-node`;

    return (
        <svg viewBox="0 0 64 64" className="h-10 w-10 overflow-visible text-accent" aria-hidden="true">
            <defs>
                <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="1.1" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id={glowStrong} x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="2.4" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <radialGradient id={link} gradientUnits="userSpaceOnUse" cx="32" cy="32" r="30">
                    <stop offset="0" stopColor="currentColor" stopOpacity="0.95" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0.35" />
                </radialGradient>

                <radialGradient id={hub} cx="50%" cy="50%" r="50%">
                    <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
                    <stop offset="0.7" stopColor="currentColor" stopOpacity="0.08" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>

                <radialGradient id={node} cx="50%" cy="50%" r="50%">
                    <stop offset="0.6" stopColor="currentColor" stopOpacity="0.18" />
                    <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>

                <linearGradient id={metal} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
                    <stop offset="0.5" stopColor="currentColor" />
                    <stop offset="1" stopColor="currentColor" />
                </linearGradient>
            </defs>

            {/* orbit ring through all 4 minds */}
            <circle
                cx="32"
                cy="32"
                r="29.7"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1.1"
            />
            {/* energy flowing around the ring */}
            <circle
                cx="32"
                cy="32"
                r="29.7"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.8"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeDasharray="5 21"
                className="motion-reduce:hidden"
            >
                <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="2.4s" repeatCount="indefinite" />
            </circle>

            {/* curved spokes + packets */}
            <Spoke angle={0} delay={0} link={link} glow={glow} />
            <Spoke angle={90} delay={0.7} link={link} glow={glow} />
            <Spoke angle={180} delay={1.4} link={link} glow={glow} />
            <Spoke angle={270} delay={2.1} link={link} glow={glow} />

            <Brain x={11} y={11} glow={glow} node={node} />
            <Brain x={53} y={11} glow={glow} node={node} />
            <Brain x={53} y={53} glow={glow} node={node} />
            <Brain x={11} y={53} glow={glow} node={node} />

            {/* hub */}
            <circle cx="32" cy="32" r="16" fill={`url(#${hub})`} />

            <circle
                cx="32"
                cy="32"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                className="motion-reduce:hidden"
            >
                <animate attributeName="r" values="10;16" dur="2.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="2.8s" repeatCount="indefinite" />
            </circle>

            <circle
                cx="32"
                cy="32"
                r="10"
                className="fill-canvas stroke-accent"
                strokeWidth="1.2"
                filter={`url(#${glowStrong})`}
            />

            {/* briefcase, softer corners */}
            <g
                stroke={`url(#${metal})`}
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={`url(#${glow})`}
            >
                <rect x="26" y="29" width="12" height="9" rx="3" />
                <path d="M29.5 29 v-1.5 a1.5 1.5 0 0 1 1.5 -1.5 h2 a1.5 1.5 0 0 1 1.5 1.5 v1.5" />
                <path d="M26.3 33.5 h11.4" />
            </g>
            <rect x="31.2" y="32.5" width="1.6" height="2" rx="0.8" fill="currentColor" />
        </svg>
    );
};


export default Logo;