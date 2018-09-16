// Copyright 2018 the Deno authors. All rights reserved. MIT license.
import * as fbs from "gen/msg_generated";
import { flatbuffers } from "flatbuffers";
import * as dispatch from "./dispatch";

/**
 * Copies the contents of one file synchronously to another.
 *
 *     import { copyFileSync } from "deno";
 *     copyFileSync("src", "dest");
 */
export function copyFileSync(src: string, dest: string): void {
  dispatch.sendSync(...req(src, dest));
}

/**
 * Copies the contents of one file to another.
 *
 *     import { copyFile } from "deno";
 *     await copyFile("src", "dest");
 */
export async function copyFile(src: string, dest: string): Promise<void> {
  await dispatch.sendAsync(...req(src, dest));
}

function req(
  src: string,
  dest: string
): [flatbuffers.Builder, fbs.Any, flatbuffers.Offset] {
  const builder = new flatbuffers.Builder();
  const src_ = builder.createString(src);
  const dest_ = builder.createString(dest);
  fbs.CopyFile.startCopyFile(builder);
  fbs.CopyFile.addSrc(builder, src_);
  fbs.CopyFile.addDest(builder, dest_);
  const msg = fbs.CopyFile.endCopyFile(builder);
  return [builder, fbs.Any.CopyFile, msg];
}
