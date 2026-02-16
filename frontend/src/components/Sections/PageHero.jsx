export default function PageHero({ title, subtitle, backgroundImage }) {
  return (
    <section className="page-hero">
      <div className="page-hero__background">
        <img
          src={backgroundImage || '/assets/images/background_wave.jpg'}
          alt=""
          className="page-hero__bg-image"
        />
        <div className="page-hero__overlay"></div>
      </div>
      <div className="page-hero__pattern"></div>
      <div className="container">
        <div className="page-hero__content">
          <h1 className="page-hero__title">{title}</h1>
          {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
