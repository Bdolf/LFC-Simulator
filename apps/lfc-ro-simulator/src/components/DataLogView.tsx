import { useMemo } from 'react';
import {
  Box, Button, Flex, Heading, HStack, SimpleGrid, Stat, StatLabel, StatNumber, Table,
  Tbody, Td, Text, Th, Thead, Tr, Badge,
} from '@chakra-ui/react';
import { SessionRec } from '../api';
import { useSim } from '../sim/store';

interface Props {
  sessions: SessionRec[];
}

export default function DataLogView({ sessions }: Props) {
  const sim = useSim();

  const live = sim.producing;
  const liveAvgPh = sim.phCount > 0 ? sim.phSum / sim.phCount : null;

  // kumulatiiviset summat (lopetetut sessiot + kuluva)
  const totals = useMemo(() => {
    let volume = 0, naoh = 0, anti = 0, hours = 0;
    let phSum = 0, phN = 0;
    for (const s of sessions) {
      volume += s.volume ?? 0;
      naoh += s.naoh ?? 0;
      anti += s.antiscalant ?? 0;
      if (s.start && s.end) hours += (s.end - s.start) / 3600000;
      if (s.ph !== null && s.ph !== undefined) { phSum += s.ph; phN++; }
    }
    return { volume, naoh, anti, hours, avgPh: phN ? phSum / phN : null };
  }, [sessions]);

  const volumeAll = totals.volume + (live ? sim.volume : 0);
  const naohAll = totals.naoh + sim.naohLiters;
  const antiAll = totals.anti + sim.antiscalantLiters;
  const phAll = liveAvgPh !== null && totals.avgPh !== null ? (totals.avgPh + liveAvgPh) / 2 : (totals.avgPh ?? liveAvgPh);

  const rows = useMemo(() => [...sessions].sort((a, b) => (b.start ?? 0) - (a.start ?? 0)), [sessions]);

  const exportCsv = () => {
    const head = ['session', 'started', 'ended', 'area', 'capacity_m3h', 'volume_m3', 'dp_bar', 'conductivity_us', 'ph', 'naoh_l', 'antiscalant_l', 'fouling_risk', 'recommendation'];
    const lines = rows.map((r) => [
      JSON.stringify(r.name),
      r.start ? new Date(r.start).toISOString() : '',
      r.end ? new Date(r.end).toISOString() : '',
      JSON.stringify(r.areaName ?? ''),
      r.capacity ?? '',
      r.volume ?? '',
      r.dp ?? '',
      r.conductivity ?? '',
      r.ph ?? '',
      r.naoh ?? '',
      r.antiscalant ?? '',
      r.foulingRisk ?? '',
      JSON.stringify(r.recommendation ?? ''),
    ].join(','));
    const csv = [head.join(','), ...lines].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lfc-ro-datalog.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Flex direction="column" gap={4} height="100%" overflowY="auto">
      <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={3}>
        <Stat className="lfc-panel" p={3}>
          <StatLabel>Total produced</StatLabel>
          <StatNumber color="#7fd8f2">{Math.round(volumeAll).toLocaleString('en-GB')} m³</StatNumber>
        </Stat>
        <Stat className="lfc-panel" p={3}>
          <StatLabel>Run hours</StatLabel>
          <StatNumber color="#e8ecf4">{totals.hours.toFixed(1)} h</StatNumber>
        </Stat>
        <Stat className="lfc-panel" p={3}>
          <StatLabel>Avg pH</StatLabel>
          <StatNumber color={phAll === null || (phAll >= 6.8 && phAll <= 8.0) ? '#38A169' : '#DD6B20'}>
            {phAll === null ? '—' : phAll.toFixed(2)}
          </StatNumber>
        </Stat>
        <Stat className="lfc-panel" p={3}>
          <StatLabel>NaOH dosed</StatLabel>
          <StatNumber color="#7bd389">{naohAll.toFixed(1)} l</StatNumber>
        </Stat>
        <Stat className="lfc-panel" p={3}>
          <StatLabel>Antiscalant dosed</StatLabel>
          <StatNumber color="#c9a227">{antiAll.toFixed(2)} l</StatNumber>
        </Stat>
        <Stat className="lfc-panel" p={3}>
          <StatLabel>Sessions logged</StatLabel>
          <StatNumber color="#e8ecf4">{rows.length}{live ? ' +1 live' : ''}</StatNumber>
        </Stat>
      </SimpleGrid>

      <Box className="lfc-panel" p={4}>
        <HStack justify="space-between" mb={2}>
          <Heading size="md" color="#e8ecf4">Cumulative datalog</Heading>
          <Button size="xs" variant="outline" colorScheme="blue" onClick={exportCsv}>Export CSV</Button>
        </HStack>
        <Table size="sm" variant="simple" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Session</Th><Th>Area</Th><Th>Started</Th><Th isNumeric>Cap m³/h</Th>
              <Th isNumeric>Volume m³</Th><Th isNumeric>ΔP bar</Th><Th isNumeric>Cond µS/cm</Th>
              <Th isNumeric>pH</Th><Th isNumeric>NaOH l</Th><Th isNumeric>Antiscal l</Th>
              <Th isNumeric>Risk</Th><Th>Recommendation</Th>
            </Tr>
          </Thead>
          <Tbody>
            {live && (
              <Tr bg="rgba(56,161,105,0.12)">
                <Td><Badge colorScheme="green">LIVE</Badge> current session</Td>
                <Td>—</Td>
                <Td>{sim.startedAt ? new Date(sim.startedAt).toLocaleTimeString('en-GB') : ''}</Td>
                <Td isNumeric>{sim.capacity}</Td>
                <Td isNumeric>{sim.volume.toFixed(0)}</Td>
                <Td isNumeric>{sim.tags.PDT103.toFixed(2)}</Td>
                <Td isNumeric>{sim.tags.CT301.toFixed(0)}</Td>
                <Td isNumeric color={sim.tags.AT501 >= 6.8 && sim.tags.AT501 <= 8.0 ? 'green.400' : 'orange.400'}>{sim.tags.AT501.toFixed(2)}</Td>
                <Td isNumeric>{sim.naohLiters.toFixed(1)}</Td>
                <Td isNumeric>{sim.antiscalantLiters.toFixed(2)}</Td>
                <Td isNumeric>{sim.fouling.toFixed(0)}</Td>
                <Td>—</Td>
              </Tr>
            )}
            {rows.map((r) => (
              <Tr key={r.id}>
                <Td>{r.name}</Td>
                <Td>{r.areaName ?? '—'}</Td>
                <Td>{r.start ? new Date(r.start).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</Td>
                <Td isNumeric>{r.capacity ?? '—'}</Td>
                <Td isNumeric>{r.volume ?? '—'}</Td>
                <Td isNumeric>{r.dp ?? '—'}</Td>
                <Td isNumeric>{r.conductivity ?? '—'}</Td>
                <Td isNumeric color={r.ph !== null && r.ph >= 6.8 && r.ph <= 8.0 ? 'green.400' : 'orange.400'}>{r.ph ?? '—'}</Td>
                <Td isNumeric>{r.naoh ?? '—'}</Td>
                <Td isNumeric>{r.antiscalant ?? '—'}</Td>
                <Td isNumeric>{r.foulingRisk ?? '—'}</Td>
                <Td><Text fontSize="xs" maxW="200px">{r.recommendation ?? '—'}</Text></Td>
              </Tr>
            ))}
            {rows.length === 0 && !live && (
              <Tr><Td colSpan={12}><Text className="lfc-muted">No logged sessions yet.</Text></Td></Tr>
            )}
          </Tbody>
        </Table>
        <Text fontSize="xs" className="lfc-muted" mt={2}>
          pH and chemical dosing are logged at session stop into Hailer (Production Sessions workflow) — totals include the running session.
        </Text>
      </Box>
    </Flex>
  );
}
