import { useMemo } from 'react';
import { Box, Flex, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Table, Tbody, Td, Text, Th, Thead, Tr, Badge } from '@chakra-ui/react';
import { ActionRec, AlertRec, SessionRec, PHASE_IDS } from '../api';

interface Props {
  sessions: SessionRec[];
  alerts: AlertRec[];
  actions: ActionRec[];
}

export default function HistoryView({ sessions: allSessions, alerts, actions }: Props) {
  const sessions = useMemo(() => allSessions.filter((s) => (s.volume ?? 0) >= 2), [allSessions]);
  const totalVolume = sessions.reduce((s, x) => s + (x.volume ?? 0), 0);
  const avgFouling = sessions.length ? sessions.reduce((s, x) => s + (x.foulingRisk ?? 0), 0) / sessions.length : 0;
  const alertsByType = alerts.reduce<Record<string, number>>((m, a) => {
    if (a.type) m[a.type] = (m[a.type] ?? 0) + 1;
    return m;
  }, {});

  return (
    <Flex direction="column" gap={4} height="100%" overflowY="auto">
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Stat bg="rgba(49,130,206,0.12)" borderRadius="lg" p={3}>
          <StatLabel>Sessions</StatLabel>
          <StatNumber>{sessions.length}</StatNumber>
        </Stat>
        <Stat bg="rgba(99,179,237,0.12)" borderRadius="lg" p={3}>
          <StatLabel>Total produced</StatLabel>
          <StatNumber>{Math.round(totalVolume).toLocaleString('en-GB')} m³</StatNumber>
        </Stat>
        <Stat bg="rgba(221,107,32,0.12)" borderRadius="lg" p={3}>
          <StatLabel>Avg fouling risk</StatLabel>
          <StatNumber>{avgFouling.toFixed(0)}</StatNumber>
        </Stat>
        <Stat bg="rgba(229,62,62,0.12)" borderRadius="lg" p={3}>
          <StatLabel>Alerts</StatLabel>
          <StatNumber>{alerts.length}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Box borderRadius="lg" borderWidth="1px" p={4}>
        <Heading size="md" mb={2}>Production sessions</Heading>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Session</Th><Th>Area</Th><Th>Started</Th><Th isNumeric>Volume m³</Th>
              <Th isNumeric>Cap m³/h</Th><Th isNumeric>ΔP bar</Th><Th isNumeric>Risk</Th><Th>Recommendation</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessions.map((s) => (
              <Tr key={s.id}>
                <Td>{s.name}</Td>
                <Td>{s.areaName ?? '—'}</Td>
                <Td>{s.start ? new Date(s.start).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</Td>
                <Td isNumeric>{s.volume ?? '—'}</Td>
                <Td isNumeric>{s.capacity ?? '—'}</Td>
                <Td isNumeric>{s.dp ?? '—'}</Td>
                <Td isNumeric>{s.foulingRisk ?? '—'}</Td>
                <Td>
                  <Text fontSize="xs" maxW="220px">{s.recommendation ?? '—'}</Text>
                </Td>
              </Tr>
            ))}
            {sessions.length === 0 && (
              <Tr><Td colSpan={8}><Text color="subtleText">No sessions yet — start production on the Process view.</Text></Td></Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
        <Box borderRadius="lg" borderWidth="1px" p={4} flex="1">
          <Heading size="md" mb={2}>Alerts by type</Heading>
          {Object.entries(alertsByType).map(([type, count]) => (
            <Flex key={type} justify="space-between" py={1}>
              <Text fontSize="sm">{type}</Text>
              <Badge colorScheme="red">{count}</Badge>
            </Flex>
          ))}
          {Object.keys(alertsByType).length === 0 && <Text color="subtleText" fontSize="sm">No alerts.</Text>}
        </Box>
        <Box borderRadius="lg" borderWidth="1px" p={4} flex="1.6">
          <Heading size="md" mb={2}>Maintenance actions</Heading>
          {actions.map((a) => (
            <Flex key={a.id} justify="space-between" py={1} borderBottomWidth="1px">
              <Text fontSize="sm">{a.name}</Text>
              <Badge colorScheme={a.phase === PHASE_IDS.actionDone ? 'green' : a.phase === PHASE_IDS.actionClosed ? 'gray' : 'blue'}>
                {a.phase === PHASE_IDS.actionDone ? 'Done' : a.phase === PHASE_IDS.actionClosed ? 'Closed' : 'Open'}
              </Badge>
            </Flex>
          ))}
          {actions.length === 0 && <Text color="subtleText" fontSize="sm">No maintenance actions.</Text>}
        </Box>
      </Flex>
    </Flex>
  );
}
