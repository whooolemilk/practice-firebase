import { ReactNode } from "react";
import { Container, Flex } from "@chakra-ui/react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex
      minH={"100vh"}
      direction={"column"}
      bgColor={"base"}
      overflowX={"scroll"}
    >
      <Container
        as={"main"}
        maxW={"container.md"}
        minW={"container.sm"}
        px={"1.6rem"}
      >
        {children}
      </Container>
    </Flex>
  );
};
