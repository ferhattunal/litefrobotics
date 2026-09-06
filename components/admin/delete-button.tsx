type Props = {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
};

export function DeleteButton({ action, id, label = "Sil" }: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm text-red-700 hover:underline">
        {label}
      </button>
    </form>
  );
}
