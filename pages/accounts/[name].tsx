import { Avatar, Button, Container, Group, Tabs, Text, Title } from "@mantine/core";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Id, Logout, Settings, Users } from "tabler-icons-react";

import { CharacterCard } from "../../components/character-card";
import { CreateCharacterModal } from "../../components/create-character-modal";
import { Loader } from "../../components/loader";
import { withSSRAuth } from "../../hocs/with-ssr-auth";
import { useGetAccountByNameQuery } from "../../store/api/accounts";

type AccountPageProps = {
  name: string;
};

export default function Account({ name }: AccountPageProps): JSX.Element {
  const { data: sessionData, status } = useSession();
  const { data } = useGetAccountByNameQuery(name);
  const router = useRouter();
  const accountTL = useTranslation("account");
  const commonTL = useTranslation("common");

  if (!data) {
    return <Loader />;
  }

  return (
    <Container size="xs">
      <Head>
        <title>
          {name} &bull; {commonTL.t("app-name")}
        </title>
      </Head>
      <Avatar mb="sm" mx="auto" size="xl" />
      <Text align="center">{accountTL.t("welcome")}</Text>
      <Title align="center" sx={(theme) => ({ color: theme.colors[theme.primaryColor][5] })}>
        {data.account?.sakura_account?.real_name ?? name}
      </Title>
      {data.account?.sakura_account?.real_name && (
        <Title align="center" color="dimmed" order={5}>
          {name}
        </Title>
      )}

      {status === "authenticated" && sessionData?.user?.name === name && <CreateCharacterModal />}

      <Tabs mt="md" position="center" variant="pills">
        <Tabs.Tab label={accountTL.t("id.title")} icon={<Id />}>
          <Group align="baseline" spacing="xs">
            <Title order={4}>{accountTL.t("id.group")}</Title>
            <Text>{data?.account.type}</Text>
          </Group>
          <Group align="baseline" spacing="xs">
            <Title order={4}>{accountTL.t("id.premium")}</Title>
            <Text color={data?.account.premium_ends_at === 0 ? "red" : "green"}>
              {data?.account.premium_ends_at === 0
                ? accountTL.t("id.premium-not-activated")
                : accountTL.t("id.premium-ends-at", {
                    date: dayjs.unix(data?.account.premium_ends_at).format("DD/MM/YYYY HH:mm"),
                  })}
            </Text>
          </Group>
          <Group align="baseline" spacing="xs">
            <Title order={4}>{accountTL.t("id.total-characters")}</Title>
            <Text>{data?.account.players?.length}</Text>
          </Group>
          <Group align="baseline" spacing="xs">
            <Title order={4}>{accountTL.t("id.created-at")}</Title>
            <Text>{dayjs.unix(data?.account.creation).format("DD/MM/YYYY HH:mm")}</Text>
          </Group>
        </Tabs.Tab>
        <Tabs.Tab label={accountTL.t("characters.title")} icon={<Users />}>
          {data?.account.players?.map((character) => (
            <CharacterCard key={character.name + character.id} character={character} />
          ))}
        </Tabs.Tab>
        {status === "authenticated" && sessionData?.user?.name === name && (
          <Tabs.Tab label={accountTL.t("settings.title")} icon={<Settings />}>
            <Button
              fullWidth
              leftIcon={<Logout />}
              onClick={() => signOut({ redirect: false }).then(() => router.push("/login"))}
            >
              {accountTL.t("settings.logout")}
            </Button>
          </Tabs.Tab>
        )}
      </Tabs>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = withSSRAuth(async (context) => {
  const session = await getSession(context);

  return {
    props: {
      name: context.params?.name,
      session,
      ...(await serverSideTranslations(context.locale ?? "en", ["account", "common"])),
    },
  };
});