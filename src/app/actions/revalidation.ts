"use server"

import { revalidatePath } from "next/cache"

export async function revalidateSSGPath(path: string) {
    return revalidatePath(path);
}
