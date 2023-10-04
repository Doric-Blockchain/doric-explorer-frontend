import {
  Box,
  Grid,
  Flex,
  Text,
  Link,
  VStack,
  Skeleton,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import discussionsIcon from 'icons/discussions.svg';
import editIcon from 'icons/edit.svg';
import cannyIcon from 'icons/social/canny.svg';
import telegramIcon from 'icons/social/telegram_filled.svg';
import gitIcon from 'icons/social/git.svg';
import twitterIcon from 'icons/social/tweet.svg';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import useIssueUrl from 'lib/hooks/useIssueUrl';
import IndexingAlertIntTxs from 'ui/home/IndexingAlertIntTxs';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import ColorModeToggler from '../header/ColorModeToggler';
import FooterLinkItem from './FooterLinkItem';
import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 3;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${config.UI.footer.frontendVersion}`;

const Footer = () => {
  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS = [
    {
      icon: gitIcon,
      iconSize: '18px',
      text: 'Contribute',
      url: 'https://github.com/Doric-Blockchain/doric-explorer-frontend',
    },
    {
      icon: twitterIcon,
      iconSize: '18px',
      text: 'Twitter',
      url: 'https://twitter.com/DoricOfficial',
    },
    {
      icon: telegramIcon,
      iconSize: '18px',
      text: 'Telegram',
      url: 'https://t.me/doricnetwork',
    },
    {
      icon: discussionsIcon,
      iconSize: '20px',
      text: 'Discussions',
      url: 'https://github.com/orgs/Doric-Blockchain/discussions',
    },
  ];

  const fetch = useFetch();

  const { isLoading, data: linksData } = useQuery<
    unknown,
    ResourceError<unknown>,
    Array<CustomLinksGroup>
  >(['footer-links'], async () => fetch(config.UI.footer.links || ''), {
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
  });

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      p={{ base: 4, lg: 9 }}
      borderTop='1px solid'
      borderColor='divider'
      as='footer'
      columnGap='100px'
    >
      <Box flexGrow='1' mb={{ base: 8, lg: 0 }}>
        <Flex flexWrap='wrap' columnGap={8} rowGap={6}>
          <ColorModeToggler />
          {!config.UI.indexingAlert.isHidden && <IndexingAlertIntTxs />}
          <NetworkAddToWallet />
        </Flex>
        <Box mt={{ base: 5, lg: '44px' }}>
          <Link fontSize='xs' href='https://doric.network/'>
            doric.network
          </Link>
        </Box>
        <Text mt={3} maxW={{ base: 'unset', lg: '470px' }} fontSize='xs'>
          Blockchain explorer for Doric Network.
        </Text>
        <VStack spacing={1} mt={6} alignItems='start'>
          {apiVersionUrl && (
            <Text fontSize='xs'>
              Backend:{' '}
              <Link href={apiVersionUrl} target='_blank'>
                {backendVersionData?.backend_version}
              </Link>
            </Text>
          )}
          {(config.UI.footer.frontendVersion ||
            config.UI.footer.frontendCommit) && (
            <Text fontSize='xs'>
              Frontend:{' '}
              <Link href={FRONT_VERSION_URL} target='_blank'>
                {config.UI.footer.frontendVersion}
              </Link>
            </Text>
          )}
        </VStack>
      </Box>
      <Grid
        gap={{ base: 6, lg: 12 }}
        gridTemplateColumns={
          config.UI.footer.links
            ? {
                base: 'repeat(auto-fill, 160px)',
                lg: `repeat(${
                  (linksData?.length || MAX_LINKS_COLUMNS) + 1
                }, 160px)`,
              }
            : 'auto'
        }
      >
        <Box minW='160px' w={config.UI.footer.links ? '160px' : '100%'}>
          {config.UI.footer.links && (
            <Text fontWeight={500} mb={3}>
              Doric Network
            </Text>
          )}
          <Grid
            gap={1}
            gridTemplateColumns={
              config.UI.footer.links
                ? '160px'
                : { base: 'repeat(auto-fill, 160px)', lg: 'repeat(3, 160px)' }
            }
            gridTemplateRows={{
              base: 'auto',
              lg: config.UI.footer.links ? 'auto' : 'repeat(2, auto)',
            }}
            gridAutoFlow={{
              base: 'row',
              lg: config.UI.footer.links ? 'row' : 'column',
            }}
            mt={{ base: 0, lg: config.UI.footer.links ? 0 : '100px' }}
          >
            {BLOCKSCOUT_LINKS.map((link) => (
              <FooterLinkItem {...link} key={link.text} />
            ))}
          </Grid>
        </Box>
      </Grid>
    </Flex>
  );
};

export default Footer;
