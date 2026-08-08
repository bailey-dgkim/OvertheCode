/**
 * 키워드 pill과 계층 배지를 함께 담당한다.
 * 계층은 색상만으로 구분하지 않도록 항상 텍스트 라벨을 함께 노출한다.
 */
function Badge({ variant = 'keyword', layer, children }) {
  const className =
    variant === 'layer'
      ? `oc-badge oc-badge--layer oc-badge--layer-${layer}`
      : `oc-badge oc-badge--${variant}`;

  return <span className={className}>{children}</span>;
}

export function BadgeList({ items, variant = 'keyword', label }) {
  if (!items?.length) return null;

  return (
    <div>
      {label && <p className="oc-feedback__keywords-label">{label}</p>}
      <div className="oc-badge-list">
        {items.map((item) => (
          <Badge key={item} variant={variant}>
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default Badge;
