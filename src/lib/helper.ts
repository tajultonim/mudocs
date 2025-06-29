export async function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const screen = { width: window.screen.width, height: window.screen.height };
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let country = null,
    city = null,
    region = null,
    ip = null;
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    country = data.country_name || data.country;
    city = data.city;
    region = data.region;
    ip = data.ip;
  } catch (e) {
    console.log(e);
  }
  return {
    userAgent,
    platform,
    language,
    screen,
    timezone,
    country,
    city,
    region,
    ip,
  };
}
