import { db } from "..";
import { campuses } from "../schema";

async function seedCampus() {
  const existing = await db.select().from(campuses).limit(1);
  if (existing.length > 0) {
    console.log("Campus already exists:", existing[0].campusName);
    return;
  }

  const [c] = await db
    .insert(campuses)
    .values({
      campusCode: "TLU",
      campusName: "Trường Đại học Thủy Lợi",
      address: "175 Tây Sơn, Đống Đa, Hà Nội",
    })
    .returning();

  console.log("Created campus:", c.campusName, "(ID:", c.id + ")");
}

seedCampus()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed campus:", err);
    process.exit(1);
  });
