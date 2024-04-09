import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.cookies.get("key")?.value !== "prikey") {
    return NextResponse.json({ status: 401 });
  }
  return NextResponse.json(process.env);
}
