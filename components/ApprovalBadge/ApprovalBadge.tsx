import { Badge } from '@mantine/core';

export default function ApprovalBadge({ isApproved }: { isApproved: boolean | null }) {
  let badgeColor;
  switch (isApproved) {
    case true:
      badgeColor = 'green';
      break;
    case false:
      badgeColor = 'red';
      break;
    case null:
      badgeColor = '#54D0ED';
      break;
  }

  let badgeText;
  switch (isApproved) {
    case true:
      badgeText = 'APPROVED';
      break;
    case false:
      badgeText = 'REJECTED';
      break;
    case null:
      badgeText = 'PENDING';
      break;
  }

  return (
    <Badge variant="filled" color={badgeColor} size="md" radius="xl">
      {badgeText}
    </Badge>
  );
}
