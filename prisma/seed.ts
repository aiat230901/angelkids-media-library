import "dotenv/config";
import { getPrisma } from "../src/server/db";
import { loadCatalog } from "../src/server/content";
import { syncReferenceData } from "../src/server/sync-catalog";

const prisma = getPrisma();
const catalog = await loadCatalog();
await prisma.$transaction((tx) => syncReferenceData(tx, catalog));
await prisma.$disconnect();
console.log("Đã seed navigation, Level và Curriculum Unit.");

