import React from "react";
import { Image } from "@chakra-ui/react";

export default function ImgLoad({ name }: { name: string }) {
  return (
    <div>
      <picture>
        <source type="image/webp" srcSet={`/asset/img/${name}.webp`} />
        <Image src={`/asset/img/${name}.png`} alt="img" width="100%" h="100%" />
      </picture>
    </div>
  );
}
