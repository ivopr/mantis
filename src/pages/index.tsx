import { Box, Button, Divider, Heading, SimpleGrid } from "@chakra-ui/react";
import { Layout } from "@sword/components/layout";
import { SideMenu } from "@sword/components/side-menu-options";
import { decrement, increment } from "@sword/store/slices/counter";
import { RootState } from "@sword/store/store";
import type { GetStaticProps, NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";

type FunnyMenu = {
  name: string;
  childs?: FunnyMenu[];
  action?: () => void;
};

const MenuArray: FunnyMenu[] = [
  {
    name: "Option 1",
    childs: [
      {
        name: "Sub-Option 1",
        action: () => console.log("IVO GAY"),
      },
    ],
  },
  {
    name: "Option 2",
    childs: [
      {
        name: "Sub-Option 1",
        childs: [
          {
            name: "Sub-Sub-Option 1",
          },
        ],
      },
      {
        name: "Sub-Option 2",
      },
    ],
  },
  {
    name: "Option 3",
  },
  {
    name: "Option 4",
  },
  {
    name: "Option 5",
  },
];

const Home: NextPage = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <Layout pageTitle="Home" maxW="full" maxH="full">
      <SimpleGrid
        gap="5"
        height="full"
        columns={{
          base: 1,
          md: 2,
        }}
        marginX="auto"
      >
        <Box flexDirection={{ base: "column", md: "row" }} display="flex" width="full">
          <SideMenu options={MenuArray} />
          <Divider
            display={{ base: "none", md: "flex" }}
            borderStartWidth={5}
            orientation="vertical"
          />
          <Divider
            display={{ base: "flex", md: "none" }}
            borderStartWidth={5}
            orientation="horizontal"
          />
        </Box>
        <Heading>{count}</Heading>
        <Button onClick={() => dispatch(increment())}>Increment</Button>
        <Button onClick={() => dispatch(decrement())}>Decrement</Button>
      </SimpleGrid>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`@sword/locales/${locale}.json`)).default,
    },
  };
};

export default Home;
