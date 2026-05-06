import { getBlocks } from "./actions";
import BlocksClient from "./blocks-client";

export default async function AdminBlocksPage() {
  const blocks = await getBlocks();
  return <BlocksClient initialBlocks={blocks} />;
}
