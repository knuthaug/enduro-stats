import { detect } from "detect-browser";
import { onLCP, onFCP, onCLS, onTTFB, onINP } from "web-vitals";

const baseURL = "https://api.knuthaugen.no";

document.addEventListener("DOMContentLoaded", function (event) {
  const values = {
    cls: "",
    ttfb: "",
    inp: "",
    lcp: "",
    fcp: "",
  };

  onLCP(
    ({ value }) => {
      values.lcp = `${Math.round(value)}`;
    },
    { reportAllChanges: true },
  );

  onFCP(
    ({ value }) => {
      values.fcp = `${Math.round(value)}`;
    },
    { reportAllChanges: true },
  );

  onINP(
    ({ value }) => {
      console.log(`INP time: ${Math.round(value)}`);
      writeINP(value);
    },
    { reportAllChanges: true },
  );

  onCLS(
    ({ value }) => {
      values.cls = `${value}`;
    },
    { reportAllChanges: true },
  );

  onTTFB(
    ({ value }) => {
      values.ttfb = `${Math.round(value)}`;
    },
    { reportAllChanges: true },
  );

  setTimeout(() => {
    console.log("Web Vitals", values);
    writeVitals(values);
  }, 1500);

  writeHit();
});

async function getToken(page) {
  try {
    const res = await fetch(`${baseURL}/token`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({ path: page }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await res.json();
    return body.token;
  } catch (err) {
    console.error(err);
    return "";
  }
}

async function writeVitals(vitals, page = document.location.pathname) {
  const token = await getToken(page);
  const browser = detect();

  try {
    const res = await fetch(`${baseURL}/vitals`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        ...vitals,
        page: page,
        domain: "norskenduro.no",
        browser: browser?.name,
        browserVersion: browser?.version,
        os: browser?.os,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    });
    const body = await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function writeINP(inp, page = document.location.pathname) {
  const token = await getToken(page);
  const browser = detect();

  try {
    const res = await fetch(`${baseURL}/inp`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        inp,
        page: page,
        domain: "norskenduro.no",
        browser: browser?.name,
        browserVersion: browser?.version,
        os: browser?.os,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    });
    const body = await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function writeHit(page = document.location.pathname) {
  const browser = detect();

  try {
    const res = await fetch(`${baseURL}/hit`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        count: 1,
        page: page,
        domain: "norskenduro.no",
        browser: browser?.name,
        browserVersion: browser?.version,
        os: browser?.os,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await res.json();
    //console.log("hit message", body.message);
  } catch (err) {
    console.error(err);
  }
}
