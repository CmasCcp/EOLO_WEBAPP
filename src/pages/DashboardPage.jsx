import { Breadcrumb } from "../components/Breadcrumb"
import { Navbar } from "../components/Navbar"

export const DashboardPage = () => {
  let width = window.innerWidth * 0.98;
  let height = window.innerHeight * 0.95;
  return (
    // <div>DashboardPage</div>
    <>
      <Navbar />
      <div className="container mt-5">
        <Breadcrumb />


      </div>
      <iframe title="Sample Report Demo" width={width} height={height} src="https://playground.powerbi.com/sampleReportEmbed" frameborder="0" allowFullScreen="true"></iframe>
    </>
  )
}
