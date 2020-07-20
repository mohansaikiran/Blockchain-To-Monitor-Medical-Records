import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <body>
      <div id="content">
        <h1>Add Details</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          const age=this.productid.value
          this.props.createPatient(age,name, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productid"
              type="text"
              ref={(input) => { this.productid = input }}
              className="form-control"
              placeholder="Product ID"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Patient details</button>
       
       
        </form>
        
        
      </div>

            <div id="content">
            <h1>Add Doctor</h1>
            <form onSubmit={(event) => {
              event.preventDefault()
              const docname = this.DoctorName.value
              const id = this.doctorid.value
              this.props.createDoctor(id,docname)
            }}>
              <div className="form-group mr-sm-2">
                <input
                  id="DoctorName"
                  type="text"
                  ref={(input) => { this.DoctorName = input }}
                  className="form-control"
                  placeholder="Doctor Name"
                  required />
              </div>
              
              <div className="form-group mr-sm-2">
                <input
                  id="doctorid"
                  type="text"
                  ref={(input) => { this.doctorid = input }}
                  className="form-control"
                  placeholder="Doctor ID"
                  required />
              </div>
              <button type="submit" className="btn btn-primary">Add Doctor</button>
            </form>
            <p> </p>
            
          </div>
          <h2>Doctors</h2>
        <table className="table">
          <tbody id="DoctorsList">
              { this.props.doctors.map((doctor,key)=> { 
                  return(
                    <tr key={key}>
                    <th scope="row">{doctor.id.toString()}</th>
                    <td>{doctor.name}</td>
                 <td>
<button className="btn btn-primary"
        onClick=
        {
          (event)=>{
            console.log(this.props.acc)
            const val1=1;
            const val2=doctor.id;
              this.props.bookAppointment(val1,val2);
          }
        }>Book Appointment
           </button>
</td>
                  </tr>
                  )
              })}
          
            
          </tbody>
        </table>



<h2>Appointments</h2>
        <table className="table">
          <tbody id="AppointmentsList">
              { this.props.appointments.map((apps,key)=> { 
                  return(
                    <tr key={key}>
                    <th scope="row">{apps.patname}</th>
                    <td>{apps.docname}</td>
                 <td>
<button className="btn btn-primary"
        onClick=
        {
          (event)=>{
            const val1=apps.patadd;
            const val2=apps.docadd;
              this.props.ApproveAppointment(val1,val2);
          }
        }>Approve Appointment
           </button>
</td>
                  </tr>
                  )
              })}
          
            
          </tbody>
        </table>


<button
  onClick= {
    (event)=>{
      const val="0x1e4A45d90642341795A54e1DF0166175C66441DE";
      const val1=this.props.searchPatient(val);
    }
  }>

  </button> 
<h3>
{this.props.pat}
</h3>
       
          </body>
    );
  }
}

export default Main;