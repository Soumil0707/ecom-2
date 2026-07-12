import Link from "next/link"

const ReturnPage = async ({ searchParams }: { searchParams: Promise<{ session_id: string }> | undefined }) => {
    const { session_id } = (await searchParams) || {}
    if (!session_id) {
        return (<div>No session id found</div>)
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_PAYMENT_SEVICE_URL}/sessions/${session_id}`, {
        method: "GET"
    })
    const data = await res.json()
    return (
        <div>
            <h1>Payment {data.status} and payment status {data.paymentStatus}</h1>
            <Link href="/orders">See your orders</Link>
        </div>
    )
}

export default ReturnPage