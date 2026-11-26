import { useMemo } from 'react';
import { Badge, Box, Button, Flex, Heading, HStack, Text, VStack, SimpleGrid, Tag } from '@chakra-ui/react';
import { useSim } from '../sim/store';
import { ActionRec, AlertRec, InstructionRec, SessionRec, completeAction, ackAlert, PHASE_IDS } from '../api';

interface Props {
  instructions: InstructionRec[];
  actions: ActionRec[];
  alerts: AlertRec[];
  sessions: SessionRec[];
  onRefresh: () => void;
}

export default function MaintenanceView({ instructions, actions, alerts, sessions, onRefresh }: Props) {
  const sim = useSim();
  const instructionByType = useMemo(() => {
    const m: Record<string, InstructionRec> = {};
    instructions.forEach((i) => { m[i.actionType] = i; });
    return m;
  }, [instructions]);

  const activeRecommendation = sim.pendingRecommendation ?? (sim.producing ? null : null);
  const openActions = actions.filter((a) => a.phase !== PHASE_IDS.actionClosed);
  const activeAlerts = alerts.filter((a) => a.phase !== PHASE_IDS.alertClosed);
  const lastSession = sessions.find((s) => s.recommendation && s.recommendation !== 'Normal stop');

  const stepList = (steps: string) => steps.split('\n').filter(Boolean);

  return (
    <Flex gap={4} direction={{ base: 'column', xl: 'row' }} height="100%" overflowY="auto" align="flex-start">
      {/* Nykyinen suositus */}
      <VStack align="stretch" spacing={4} flex="1.1" minW="320px">
        <Box borderRadius="lg" borderWidth="1px" p={4}>
          <Heading size="md" mb={2}>Current recommendation</Heading>
          {activeRecommendation ? (
            <>
              <HStack flexWrap="wrap" mb={3}>
                {activeRecommendation.map((r) => <Tag key={r} colorScheme={r === 'Normal stop' ? 'green' : 'orange'} size="lg">{r}</Tag>)}
              </HStack>
              {activeRecommendation.filter((r) => r !== 'Normal stop').map((r) => {
                const inst = instructionByType[r];
                if (!inst) return null;
                return (
                  <Box key={r} mb={3} pl={3} borderLeft="3px solid #DD6B20">
                    <Text fontWeight="bold">{inst.name} · {inst.durationH ?? '—'} h · {inst.chemicals ?? 'no chemicals'}</Text>
                    <VStack align="stretch" spacing={0} mt={1}>
                      {stepList(inst.steps).map((s) => <Text key={s} fontSize="sm">{s}</Text>)}
                    </VStack>
                    {inst.safety && <Text mt={2} fontSize="xs" color="red.300">⚠ {inst.safety}</Text>}
                  </Box>
                );
              })}
            </>
          ) : lastSession ? (
            <Box>
              <Text mb={2} color="subtleText">From last session {lastSession.name}:</Text>
              <Tag colorScheme="orange" size="lg">{lastSession.recommendation}</Tag>
              <Text mt={2} fontSize="sm" color="subtleText">Start & stop a production session to get a fresh recommendation.</Text>
            </Box>
          ) : (
            <Text color="subtleText">No active recommendation. Start and stop production on the Process view — the rule engine (fish farm 500 m, shallows &lt; 10 m, volume &gt; 1500 m³) produces the guidance automatically.</Text>
          )}
        </Box>

        <Box borderRadius="lg" borderWidth="1px" p={4}>
          <Heading size="md" mb={2}>Open maintenance actions</Heading>
          {openActions.length === 0 && <Text color="subtleText" fontSize="sm">No open actions.</Text>}
          <VStack align="stretch" spacing={2}>
            {openActions.map((a) => (
              <Flex key={a.id} justify="space-between" align="center" borderWidth="1px" borderRadius="md" p={2}>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">{a.name}</Text>
                  <Text fontSize="xs" color="subtleText">{a.actionType} · {a.notes}</Text>
                </Box>
                <Button
                  size="xs" colorScheme="green"
                  onClick={() => { void completeAction(a.id).then(onRefresh); }}
                >Mark done</Button>
              </Flex>
            ))}
          </VStack>
        </Box>

        <Box borderRadius="lg" borderWidth="1px" p={4}>
          <Heading size="md" mb={2}>Active alerts</Heading>
          {activeAlerts.length === 0 && <Text color="subtleText" fontSize="sm">No active alerts.</Text>}
          <VStack align="stretch" spacing={2}>
            {activeAlerts.map((al) => (
              <Flex key={al.id} justify="space-between" align="center" borderWidth="1px" borderRadius="md" p={2} bg={al.severity === 'Critical' ? 'red.900' : 'orange.900'}>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">{al.type} <Badge ml={1} colorScheme={al.severity === 'Critical' ? 'red' : 'yellow'}>{al.severity}</Badge></Text>
                  <Text fontSize="xs">{al.message}</Text>
                </Box>
                {al.phase === PHASE_IDS.alertActive && (
                  <Button size="xs" onClick={() => { void ackAlert(al.id).then(onRefresh); }}>Acknowledge</Button>
                )}
              </Flex>
            ))}
          </VStack>
        </Box>
      </VStack>

      {/* Ohjekirjasto */}
      <Box borderRadius="lg" borderWidth="1px" p={4} flex="1" minW="320px" alignSelf="stretch">
        <Heading size="md" mb={3}>Instruction library</Heading>
        <SimpleGrid columns={1} spacing={4}>
          {instructions.map((i) => (
            <Box key={i.id} borderWidth="1px" borderRadius="md" p={3}>
              <HStack justify="space-between">
                <Text fontWeight="bold">{i.name}</Text>
                <Badge colorScheme={i.actionType === 'CIP flush' ? 'red' : i.actionType === 'Normal stop' ? 'green' : 'orange'}>{i.actionType}</Badge>
              </HStack>
              <Text fontSize="xs" color="subtleText" mt={1}>Trigger: {i.trigger}</Text>
              <VStack align="stretch" spacing={0} mt={2}>
                {stepList(i.steps).map((s) => <Text key={s} fontSize="sm">{s}</Text>)}
              </VStack>
              {i.chemicals && i.chemicals !== 'None' && <Text mt={2} fontSize="sm">Chemicals: {i.chemicals}</Text>}
              {i.safety && i.safety !== 'None' && <Text mt={1} fontSize="xs" color="red.300">⚠ {i.safety}</Text>}
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}
