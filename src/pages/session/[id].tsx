import { useRouter } from "next/router";

export default function Session() {
    const router = useRouter();
    const id = router.query.id;

    return <>ID: {id}</>;
}
