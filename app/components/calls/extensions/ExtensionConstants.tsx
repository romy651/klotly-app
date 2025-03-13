const ExtensionConstants = {
  extensions: "extensions",
  linkPreview: "link-preview",
  smartReply: "smart-reply",
  messageTranslation: "message-translation",
  profanityFilter: "profanity-filter",
  imageModeration: "image-moderation",
  thumbnailGeneration: "thumbnail-generation",
  sentimentalAnalysis: "sentiment-analysis",
  polls: "polls",
  reactions: "reactions",
  whiteboard: "whiteboard",
  document: "document",
  dataMasking: "data-masking",
  stickers: "stickers",
  xssFilter: "xss-filter",
  saveMessage: "save-message",
  pinMessage: "pin-message",
  voiceTranscription: "voice-transcription",
  richMedia: "rich-media",
  malwareScanner: "virus-malware-scanner",
  mentions: "mentions",
  customStickers: "customStickers",
  defaultStickers: "defaultStickers",
  stickerUrl: "stickerUrl",
  sanitizedText: "sanitized_text",
  hasXSS: "hasXSS",
  yes: "yes", //not sure
  post: "POST",
  data: "data",
  sensitiveData: "sensitive_data",
  messageMasked: "message_masked",
  profanity: "profanity",
  messageClean: "message_clean",
};

const ExtensionURLs = {
  reaction: "v1/react",
  stickers: "v1/fetch",
  document: "v1/create",
  whiteboard: "v1/create",
  translate: "v2/translate",
  poll: "v2/create",
};


const ExtensionTypeConstants = {
  extensionPoll: "extension_poll",
  sticker: "extension_sticker",
  document: "extension_document",
  whiteboard: "extension_whiteboard"
};

export { ExtensionConstants, ExtensionURLs,  ExtensionTypeConstants};