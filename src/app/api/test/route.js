import chains from "@/lib/chains";
import { NextResponse } from "next/server";

export async function GET(request) {
    return NextResponse.json({
        chains: chains.filter(chain => chain.name === 'bsc')
    });
}