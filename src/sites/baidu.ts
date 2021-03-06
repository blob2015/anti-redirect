import http from "gm-http";
import { IProvider } from "../provider";
import {
  // queryParser,
  getRedirect,
  increaseRedirect,
  decreaseRedirect,
  antiRedirect
} from "../utils";

export class BaiduProvider implements IProvider {
  public test = /www\.baidu\.com\/link\?url=/;
  public resolve(aElement: HTMLAnchorElement) {
    if (getRedirect(aElement) <= 2 && this.test.test(aElement.href)) {
      increaseRedirect(aElement);
      this.handlerOneElement(aElement)
        .then(res => {
          decreaseRedirect(aElement);
        })
        .catch(err => {
          decreaseRedirect(aElement);
        });
    }
  }

  private async handlerOneElement(aElement: HTMLAnchorElement): Promise<any> {
    try {
      const res: Response$ = await http.get(aElement.href);
      if (res.finalUrl) {
        antiRedirect(aElement, res.finalUrl);
      }
      return res;
    } catch (err) {
      console.error(err);
    }
  }
}
