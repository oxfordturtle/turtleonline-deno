import { type StatusCode, STATUS_CODE, deleteCookie, setCookie } from "http";
import { contentType } from "media_types";
import { basename, extname } from "path";
import * as bcrypt from "bcrypt";

export const htmlResponse = async (
  html: string,
  status: StatusCode = STATUS_CODE.OK,
  username?: string | null
): Promise<Response> => new Response(html, await responseInit("text/html", status, username));

export const jsonResponse = async (
  object: Record<string, unknown>,
  status: StatusCode = STATUS_CODE.OK,
  username?: string | null
): Promise<Response> =>
  new Response(JSON.stringify(object), await responseInit("application/json", status, username));

export const fileResponse = async (
  file: Uint8Array,
  path: string,
  username?: string | null
): Promise<Response> =>
  new Response(
    file,
    await responseInit(
      contentType(extname(path)) ?? "application/octet-stream",
      STATUS_CODE.OK,
      username,
      basename(path)
    )
  );

export const redirectResponse = async (path: string, username?: string | null): Promise<Response> =>
  new Response(null, await redirectResponseInit(path, username));

const responseInit = async (
  contentType: string,
  status: number,
  username?: string | null,
  filename?: string
): Promise<ResponseInit> => {
  const headers = new Headers(headersInit(contentType));
  if (filename !== undefined) {
    headers.append("content-disposition", `inline; filename=${filename}`);
  }
  await fixCookies(headers, username);
  return { headers, status };
};

const redirectResponseInit = async (
  url: string,
  username?: string | null
): Promise<ResponseInit> => {
  const headers = new Headers();
  headers.append("location", url);
  await fixCookies(headers, username);
  return { headers, status: STATUS_CODE.Found };
};

const headersInit = (contentType: string): HeadersInit => ({
  "content-type": contentType,
  date: new Date().toUTCString(),
});

const fixCookies = async (headers: Headers, username?: string | null): Promise<void> => {
  if (username !== undefined) {
    if (username === null) {
      deleteCookie(headers, "username");
    } else {
      const key = await bcrypt.hash(username, await bcrypt.genSalt());
      setCookie(headers, { name: "username", value: username });
      setCookie(headers, { name: "key", value: key });
    }
  }
};
