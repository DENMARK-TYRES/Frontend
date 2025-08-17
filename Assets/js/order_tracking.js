// Path to the simulated JSON data (this will act as our fake API for now)
const trackingDataUrl = "data/tracking.json";

// Attach event listener to footer link
document.addEventListener("DOMContentLoaded", () => {
  const trackingLink = document.getElementById("orderTracking");

  if (trackingLink) {
    trackingLink.addEventListener("click", (event) => {
      event.preventDefault();
      askForTrackingNumber();
    });
  }
});

// Show SweetAlert input for tracking number
function askForTrackingNumber() {
  Swal.fire({
    title: "Enter Your Tracking Number",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Track Order",
    confirmButtonColor: "#d33",
    showLoaderOnConfirm: true,
    preConfirm: (trackingNumber) => {
      if (!trackingNumber || trackingNumber.trim() === "") {
        Swal.showValidationMessage("Please enter a valid tracking number");
      }
      return trackingNumber.trim();
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      fetchTrackingData(result.value);
    }
  });
}

// Fetch tracking data from local JSON file
function fetchTrackingData(trackingNumber) {
  fetch(trackingDataUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load tracking data");
      return response.json();
    })
    .then((data) => {
      const order = data.find((item) => item.trackingNumber === trackingNumber);

      if (order) {
        Swal.fire({
          title: "📦 Order Status",
          html: `
            <div style="text-align: left; font-size: 15px; line-height: 1.6; color: #333;">
              <div style="background: #f8f9fa; padding: 12px 16px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <p><strong>Tracking Number:</strong> <span style="color:#d9534f;">${order.trackingNumber}</span></p>
              </div>
              <div style="background: #fff3cd; padding: 12px 16px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <p><strong>Status:</strong> <span style="color:#856404;">${order.status}</span></p>
              </div>
              <div style="background: #e2f0d9; padding: 12px 16px; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <p><strong>Estimated Delivery:</strong> <span style="color:#155724;">${order.estimatedDelivery}</span></p>
              </div>
              <div style="background: #e7f1ff; padding: 12px 16px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                  <p><strong>Last Location:</strong> <span style="color:#004085;">${order.lastLocation}</span></p>
              </div>
            </div>
          `,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
          width: "400px",
          backdrop: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        });
      } else {
        Swal.fire({
            title: "❌ Order Not Found",
            html: `
                <p>Please make sure you are entering the tracking number exactly as it appears in your order confirmation email.</p>
                <p>If you still have issues, contact our support team for assistance.</p>
            `,
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#d33",
            width: "400px",
            backdrop: true,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
            }
        );
      }
    })
    .catch((error) => {
      console.error(error);
      Swal.fire("Error", "Something went wrong while fetching tracking data.", "error");
    });
}
