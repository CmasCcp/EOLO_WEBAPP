import { Navbar } from "../components/Navbar"

export const DashboardPage = () => {
  let width = window.innerWidth
  let height = window.innerHeight
  return (
    // <div>DashboardPage</div>
    <>
      <Navbar />

      <iframe title="Sample Report Demo" width={width} height={height} src="https://playground.powerbi.com/sampleReportEmbed" frameborder="0" allowFullScreen="true"></iframe>
    </>
  )
}
