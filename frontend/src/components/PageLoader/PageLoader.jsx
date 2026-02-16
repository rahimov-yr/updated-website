import './PageLoader.css'

export default function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader__inner">
        <div className="page-loader__spinner">
          <div className="page-loader__ring"></div>
          <div className="page-loader__ring"></div>
        </div>
        <div className="page-loader__bars">
          <div className="page-loader__bar"></div>
          <div className="page-loader__bar"></div>
          <div className="page-loader__bar"></div>
        </div>
      </div>
    </div>
  )
}
