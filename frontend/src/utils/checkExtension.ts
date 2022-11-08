/**
 *
 * @param onSuccess
 * 익스텐션이 활성화 되어있으면 실행할 콜백함수
 * @param onError
 * 익스텐션이 활성화 안되어있으면 실행할 콜백함수
 */
export default function checkExtension(
  onSuccess: (response: any) => void,
  onError: (e: any) => void
) {
  try {
    chrome.runtime.sendMessage(
      process.env.REACT_APP_EXTENSION_ID as string,
      "version",
      response => {
        if (response) onSuccess(response);
      }
    );
  } catch (e) {
    // window.open(process.env.REACT_APP_EXTENSION_URL as string, "_blank");
    onError(e);
  }
}
