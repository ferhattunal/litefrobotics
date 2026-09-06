type Props = {
  html: string;
  css: string;
};

export function SiteFooter({ html, css }: Props) {
  return (
    <div className="mt-auto">
      <style>{css}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
