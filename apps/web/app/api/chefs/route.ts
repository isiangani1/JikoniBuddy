import { NextResponse } from "next/server";
import { chefProfiles } from "@/data/chefs";

export async function GET() {
  return NextResponse.json({ chefs: chefProfiles });
}
