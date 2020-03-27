import React from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import Table from 'react-bootstrap/Table'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

class App extends React.Component {
    constructor() {
        super()

        this.state = {
            data: [],
            countries: [],
            country: null,
            vn: null,
            world: null
        }

    }

    onChooseCountry = async (e, value) => {
      const { data } = this.state
      const country = data.filter(item => item.Country === value)
      await this.setState({country: country[0]})
    }

    getApi = async () => {
      const apiEndPoint = 'https://api.covid19api.com/summary'
      await axios.get(apiEndPoint)
                .then((res) => {
                  const data = res.data.Countries
                  let totalCase = 0, newCase = 0, died = 0, totalRecovered = 0, vn = null, country = null
                  const countries = data.map((item) => {
                    totalCase = totalCase + item.TotalConfirmed
                    newCase = newCase + item.NewConfirmed
                    died = died + item.TotalDeaths
                    totalRecovered = totalRecovered + item.TotalRecovered
                    if (item.Country === 'Vietnam') vn = item
                    if (item.Country === 'US') country = item
                    return item.Country
                  })

                  const world = {
                    TotalConfirmed: totalCase,
                    NewConfirmed: newCase,
                    TotalDeaths: died,
                    TotalRecovered: totalRecovered
                  }

                  this.setState({countries, data, vn, world, country})
                })
    }

    async componentDidMount() {
      await this.getApi()
    }

    render() {
        const { countries, vn, world, country } = this.state
        return (
            <div>
                <div className="container">
                    <div className="text-center">
                        <h1 style={{marginTop: 50}}>COVID-19 Statistics</h1>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Số ca nhiễm</th>
                              <th>Ca mới</th>
                              <th>Tử vong</th>
                              <th>Hồi phục</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Việt Nam</td>
                              <td>{vn ? vn.TotalConfirmed : ''}</td>
                              <td>{vn ? '+' + vn.NewConfirmed : ''}</td>
                              <td className="died">{vn ? vn.TotalDeaths : ''}</td>
                              <td className="recovered">{vn ? vn.TotalRecovered : ''}</td>
                            </tr>
                            <tr>
                              <td>Thế giới</td>
                              <td>{world ? world.TotalConfirmed : ''}</td>
                              <td>{world ? '+' + world.NewConfirmed : ''}</td>
                              <td className="died">{world ? world.TotalDeaths : ''}</td>
                              <td className="recovered">{world ? world.TotalRecovered : ''}</td>
                            </tr>
                            <tr>
                              <td>
                                <Autocomplete
                                  defaultValue="US"
                                  noOptionsText={'No Options'}
                                  options={countries.filter(item => item !== 'Viet Nam' && item !== 'Vietnam')}
                                  getOptionLabel={option => option}
                                  onChange={this.onChooseCountry}
                                  renderInput={params => <TextField {...params} label="Country" variant="outlined" />}
                                />
                              </td>
                              <td>{country ? country.TotalConfirmed : ''}</td>
                              <td>{country ? '+' + country.NewConfirmed : ''}</td>
                              <td className="died">{country ? country.TotalDeaths : ''}</td>
                              <td className="recovered">{country ? country.TotalRecovered : ''}</td>
                            </tr>
                          </tbody>
                        </Table>
                    </div>
                </div>
                <hr />
                <div className="credits text-center">
                    <p>
                        <a href="http://jasonwatmore.com" target="_top">Code Complete</a>
                    </p>
                </div>
            </div>
        )
    }
}

export default App