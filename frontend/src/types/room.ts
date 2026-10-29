export type Visibility = "public" | "private";

type User = { id: string, email: string };

export type Room = {
    id: string | number;
    name: string;
    visibility: Visibility;
    owner: User
};