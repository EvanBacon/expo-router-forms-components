import * as Form from "@/components/ui/form";
import { Picture } from "@/components/ui/picture";
import { Image } from "expo-image";

export function HTMLPictureExample() {
  return (
    <Form.Section title="Details">
      <Image
        source={[
          {
            uri: "https://github.com/evanbacon.png",
            webMaxViewportWidth: 300,
          },
          {
            uri: "https://github.com/kitten.png",
            webMaxViewportWidth: 1024,
          },
        ]}
        responsivePolicy="static"
        style={{ width: 100, height: 100 }}
      />

      <Picture>
        <source
          media="(min-width: 768px) and (orientation: landscape)"
          srcSet="https://github.com/kitten.png"
        />
        <source
          media="(min-width: 768px)"
          srcSet="https://github.com/lydiahallie.png"
        />
        <source
          media="(prefers-color-scheme: dark)"
          srcSet={require("../../../assets/images/icon.png")}
        />
        <Picture.Source
          media="(max-width: 767px)"
          srcSet="https://github.com/ccheever.png"
        />
        <Picture.Image
          source="https://github.com/evanbacon.png"
          style={{ width: 100, height: 100 }}
        />
      </Picture>

      {process.env.EXPO_OS === "web" && (
        <picture>
          <source
            media="(min-width: 768px) and (orientation: landscape)"
            srcSet="https://github.com/kitten.png"
          />
          <source
            media="(min-width: 768px)"
            srcSet="https://github.com/lydiahallie.png"
          />
          <source
            media="(prefers-color-scheme: dark)"
            srcSet={require("../../../assets/images/icon.png").uri}
          />
          <source
            media="(max-width: 767px)"
            srcSet="https://github.com/ccheever.png"
          />
          <img
            src="https://github.com/evanbacon.png"
            alt="Flowers"
            style={{ width: "auto" }}
          />
        </picture>
      )}
    </Form.Section>
  );
}
