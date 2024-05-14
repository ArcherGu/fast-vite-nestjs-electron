declare global {
  interface Window {
    electron: {
      sendMsg: (msg: string) => Promise<string>
      onReplyMsg: (cb: (msg: string) => any) => void
    }
  }
}

export { }
