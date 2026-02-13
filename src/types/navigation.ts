export type NavigationType = {
    label: string;
    href: string;
}[];

export const defaultNavigation: NavigationType = [
    {
        label: "Archive",
        href: "/archive"
    },
    {
        label: "Learn",
        href: "/learn"
    }
]