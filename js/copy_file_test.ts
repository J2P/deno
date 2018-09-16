// Copyright 2018 the Deno authors. All rights reserved. MIT license.
import { test, testPerm, assert, assertEqual } from "./test_util.ts";
import * as deno from "deno";

testPerm({ write: true }, function copyFileSyncSuccess() {
  const testDir = deno.makeTempDirSync();
  const encoder = new TextEncoder("utf-8");
  const data = encoder.encode("Hello world\n");
  deno.writeFileSync(`${testDir}/hello.txt`, data);
  const frompath = `${testDir}/hello.txt`;
  const topath = `${testDir}/hello_copy.txt`;
  deno.copyFileSync(frompath, topath);
  const copyFileInfo = deno.statSync(topath);
  assert(copyFileInfo.isFile());
});

testPerm({ write: false }, function copyFileSyncPerm() {
  let err;
  try {
    const testDir = deno.makeTempDirSync();
    const encoder = new TextEncoder("utf-8");
    const data = encoder.encode("Hello world\n");
    deno.writeFileSync(`${testDir}/hello.txt`, data);
    const frompath = `${testDir}/hello.txt`;
    const topath = `${testDir}/hello_copy.txt`;
    deno.copyFileSync(frompath, topath);
  } catch (e) {
    err = e;
  }
  assertEqual(err.kind, deno.ErrorKind.PermissionDenied);
  assertEqual(err.name, "PermissionDenied");
});

testPerm({ write: true }, async function copyFileSuccess() {
  const testDir = deno.makeTempDirSync();
  const encoder = new TextEncoder("utf-8");
  const data = encoder.encode("Hello world\n");
  deno.writeFileSync(`${testDir}/hello.txt`, data);
  const frompath = `${testDir}/hello.txt`;
  const topath = `${testDir}/hello_copy.txt`;
  await deno.copyFile(frompath, topath);
  const copyFileInfo = deno.statSync(topath);
  assert(copyFileInfo.isFile());
});
