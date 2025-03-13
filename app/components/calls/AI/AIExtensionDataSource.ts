import { CometChat } from "@cometchat/chat-sdk-react-native";

abstract class AIExtensionDataSource {
  abstract addExtension(): void;
  abstract getExtensionId(): string;

  enable(): void {
    CometChat.isAIFeatureEnabled(this.getExtensionId()).then(
      (enabled: Boolean) => {
        if (enabled) this.addExtension();
      }
    );
  }

}

export { AIExtensionDataSource };