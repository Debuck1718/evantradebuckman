import {
  DeviceType,
} from "../session/enums";

import {
  UserAgentDetector,
  UserAgentProfile,
} from "./UserAgentDetector";

/**
 * In-process User-Agent parser.
 *
 * DetectClientDevice is the platform
 * implementation of UserAgentDetector.
 *
 * It reads the User-Agent header that every
 * browser already sends, so no client-side
 * JavaScript, extra network call or third-party
 * dependency is required. Detection is best
 * effort: the values describe what the client
 * claimed, and are recorded for session review
 * rather than used for authorization.
 */
export class DetectClientDevice
  implements UserAgentDetector {

  detect(
    userAgent: string | undefined | null,
  ): UserAgentProfile {
    const value =
      typeof userAgent === "string"
        ? userAgent.trim()
        : "";

    if (!value) {
      return {
        deviceType: DeviceType.UNKNOWN,
        deviceName: null,
        browser: null,
        browserVersion: null,
        operatingSystem: null,
        operatingSystemVersion: null,
        platform: null,
        unrecognized: true,
      };
    }

    const operatingSystem =
      this.detectOperatingSystem(value);

    const browser =
      this.detectBrowser(value);

    const deviceType =
      this.detectDeviceType(
        value,
        operatingSystem,
      );

    return {
      deviceType,

      deviceName:
        this.detectDeviceName(
          value,
          operatingSystem,
          deviceType,
        ),

      browser: browser.name,
      browserVersion: browser.version,

      operatingSystem:
        operatingSystem.name,

      operatingSystemVersion:
        operatingSystem.version,

      platform: operatingSystem.platform,

      unrecognized:
        !operatingSystem.name &&
        !browser.name &&
        deviceType === DeviceType.UNKNOWN,
    };
  }

  /**
   * Derives the operating system, its version
   * and the rendering platform.
   */
  private detectOperatingSystem(userAgent: string): {
    name: string | null;
    version: string | null;
    platform: string | null;
  } {
    /*
     * Order matters.
     *
     * Windows Phone and Windows claims overlap,
     * iOS is contained in macOS User-Agents
     * ("like Mac OS X"), and Android reports
     * Linux, so the most specific patterns must
     * be tested first.
     */

    const windowsPhone =
      userAgent.match(/Windows Phone[^;]*;\s*([\d.]+)/i);

    if (windowsPhone) {
      return {
        name: "Windows Phone",
        version: windowsPhone[1] ?? null,
        platform: "Windows Phone",
      };
    }

    const windows =
      userAgent.match(/Windows NT\s+([\d.]+)/i);

    if (windows) {
      const versions: Record<string, string> = {
        "10.0": "10 / 11",
        "6.3": "8.1",
        "6.2": "8",
        "6.1": "7",
        "6.0": "Vista",
        "5.1": "XP",
      };

      const raw = windows[1] ?? "";

      return {
        name: "Windows",
        version: versions[raw] ?? raw,
        platform: "Windows",
      };
    }

    const android =
      userAgent.match(/Android\s+([\d.]+)/i);

    if (android) {
      return {
        name: "Android",
        version: android[1] ?? null,
        platform: "Android",
      };
    }

    const iOS =
      userAgent.match(/(?:iPhone|iPad|iPod).*?OS\s+([\d_]+)/i);

    if (iOS) {
      return {
        name: "iOS",
        version:
          (iOS[1] ?? "").replace(/_/g, ".") || null,
        platform: "iOS",
      };
    }

    if (/iPad|iPhone|iPod/i.test(userAgent)) {
      return {
        name: "iOS",
        version: null,
        platform: "iOS",
      };
    }

    const macOS =
      userAgent.match(/Mac OS X\s+([\d_.]+)/i);

    if (macOS) {
      return {
        name: "macOS",
        version:
          (macOS[1] ?? "").replace(/_/g, ".") || null,
        platform: "macOS",
      };
    }

    if (/CrOS/i.test(userAgent)) {
      return {
        name: "ChromeOS",
        version: null,
        platform: "ChromeOS",
      };
    }

    if (/Ubuntu/i.test(userAgent)) {
      return {
        name: "Ubuntu",
        version: null,
        platform: "Linux",
      };
    }

    if (/Fedora/i.test(userAgent)) {
      return {
        name: "Fedora",
        version: null,
        platform: "Linux",
      };
    }

    if (/Linux/i.test(userAgent)) {
      return {
        name: "Linux",
        version: null,
        platform: "Linux",
      };
    }

    if (/FreeBSD/i.test(userAgent)) {
      return {
        name: "FreeBSD",
        version: null,
        platform: "FreeBSD",
      };
    }

    return {
      name: null,
      version: null,
      platform: null,
    };
  }

  /**
   * Derives the browser family and its major
   * version.
   *
   * Chromium browsers all claim "Chrome" and
   * "Safari" for compatibility, so the most
   * specific token is tested before the generic
   * ones.
   */
  private detectBrowser(userAgent: string): {
    name: string | null;
    version: string | null;
  } {
    const match = (
      pattern: RegExp,
      name: string,
    ): { name: string; version: string | null } | null => {
      const result = userAgent.match(pattern);

      if (!result) return null;

      return {
        name,
        version: result[1] ?? null,
      };
    };

    return (
      match(/\bEdg(?:e|A|iOS)?\/([\d.]+)/i, "Edge") ??
      match(/\bOPR\/([\d.]+)/i, "Opera") ??
      match(/\bOpera\/([\d.]+)/i, "Opera") ??
      match(/\bSamsungBrowser\/([\d.]+)/i, "Samsung Internet") ??
      match(/\bYaBrowser\/([\d.]+)/i, "Yandex") ??
      match(/\bVivaldi\/([\d.]+)/i, "Vivaldi") ??
      match(/\bFxiOS\/([\d.]+)/i, "Firefox") ??
      match(/\bFirefox\/([\d.]+)/i, "Firefox") ??
      match(/\bCriOS\/([\d.]+)/i, "Chrome") ??
      match(/\bChrome\/([\d.]+)/i, "Chrome") ??
      match(/\bVersion\/([\d.]+).*Safari/i, "Safari") ??
      match(/\bSafari\/([\d.]+)/i, "Safari") ??
      match(/\bMSIE\s([\d.]+)/i, "Internet Explorer") ??
      match(/\bTrident\/.*rv:([\d.]+)/i, "Internet Explorer") ??
      /*
       * Command-line and SDK clients are common
       * on the OAuth token path, so they are
       * labelled rather than reported as unknown.
       */
      match(/\bcurl\/([\d.]+)/i, "curl") ??
      match(/\bWget\/([\d.]+)/i, "Wget") ??
      match(/\bPostmanRuntime\/([\d.]+)/i, "Postman") ??
      match(/\bnode(?:-fetch)?\b/i, "Node.js") ??
      match(/\bGo-http-client\/([\d.]+)/i, "Go HTTP Client") ??
      match(/\bpython-requests\/([\d.]+)/i, "Python Requests") ??
      {
        name: null,
        version: null,
      }
    );
  }

  /**
   * Classifies the device category.
   */
  private detectDeviceType(
    userAgent: string,
    operatingSystem: { platform: string | null },
  ): string {
    /*
     * A bot is never a person, so it is
     * classified first and never mistaken for a
     * browser session belonging to a human.
     */
    if (
      /bot|crawler|spider|crawling|slurp|bingpreview|headlesschrome|lighthouse/i.test(
        userAgent,
      )
    ) {
      return DeviceType.UNKNOWN;
    }

    if (/iPad|Tablet|PlayBook|Silk/i.test(userAgent)) {
      return DeviceType.TABLET;
    }

    /*
     * Android tablets omit "Mobile" on the same
     * header Android phones include, which is
     * the only reliable distinction between the
     * two from a User-Agent alone.
     */
    if (
      /Android/i.test(userAgent) &&
      !/Mobile/i.test(userAgent)
    ) {
      return DeviceType.TABLET;
    }

    if (
      /Mobi|iPhone|iPod|Android|Windows Phone|BlackBerry|Opera Mini|IEMobile/i.test(
        userAgent,
      )
    ) {
      return DeviceType.MOBILE;
    }

    /*
     * Machine clients are servers, not laptops.
     */
    if (
      /curl|Wget|PostmanRuntime|Go-http-client|python-requests|node-fetch|okhttp|axios|http-client/i.test(
        userAgent,
      )
    ) {
      return DeviceType.SERVER;
    }

    if (
      operatingSystem.platform === "Windows" ||
      operatingSystem.platform === "macOS" ||
      operatingSystem.platform === "Linux" ||
      operatingSystem.platform === "ChromeOS" ||
      operatingSystem.platform === "FreeBSD"
    ) {
      return DeviceType.DESKTOP;
    }

    return DeviceType.UNKNOWN;
  }

  /**
   * Produces a short human label for the
   * device, used in the security review screen.
   */
  private detectDeviceName(
    userAgent: string,
    operatingSystem: {
      name: string | null;
      version: string | null;
      platform: string | null;
    },
    deviceType: string,
  ): string | null {
    /*
     * Prefer the concrete model when the
     * User-Agent names one.
     */
    if (/iPad/i.test(userAgent)) return "iPad";

    if (/iPhone/i.test(userAgent)) return "iPhone";

    if (/iPod/i.test(userAgent)) return "iPod";

    const androidModel =
      userAgent.match(
        /Android[^;]*;\s*([^;)]+?)(?:\s+Build|\)|;)/i,
      );

    if (androidModel?.[1]) {
      const model = androidModel[1].trim();

      if (
        model &&
        !/^wv$/i.test(model) &&
        !/^[a-z]{2}[-_][A-Za-z]{2}$/.test(model)
      ) {
        return model;
      }
    }

    if (/Windows Phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (operatingSystem.platform === "Windows") {
      return "Windows PC";
    }

    if (operatingSystem.platform === "macOS") {
      return "Mac";
    }

    if (operatingSystem.platform === "ChromeOS") {
      return "Chromebook";
    }

    if (operatingSystem.platform === "Linux") {
      return "Linux Workstation";
    }

    if (
      deviceType === DeviceType.SERVER
    ) {
      return "Automated Client";
    }

    return operatingSystem.name;
  }

}