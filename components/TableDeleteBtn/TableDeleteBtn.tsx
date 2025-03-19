import { Button } from '@mantine/core';

export default function TableDeleteBtn({
  itemId,
  handleDelete,
}: {
  itemId: any;
  handleDelete: (itemId: string) => void;
}) {
  return (
    <Button
      key={itemId}
      variant="filled"
      color="red"
      size="xs"
      radius="xl"
      onClick={() => handleDelete(itemId)}
    >
      Delete
    </Button>
  );
}
