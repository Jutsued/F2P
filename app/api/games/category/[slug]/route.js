import { getCategory, getGamesByCategory } from "@/lib/freetogame";

export async function GET(_request, { params }) {
  const { slug } = await params;

  if (!getCategory(slug)) {
    return Response.json({ error: "Unknown game category." }, { status: 404 });
  }

  return Response.json(await getGamesByCategory(slug));
}
