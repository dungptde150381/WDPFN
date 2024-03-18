import React, { Component } from 'react';

class Sliderr extends Component {
    render() {
        return (

            <div id="carouselExampleFade" className="carousel slide carousel-fade"  data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="https://giaysneaker.store/media/wysiwyg/slidershow/home-12/banner_CONVERSE.jpg" height={700} alt="First slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://file.hstatic.net/200000532469/collection/air-force-1-fandy_c3028bfe03064f6eaf034be27517b2ab.jpg" height={700} alt="Second slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://cdn.coin68.com/images/20230418052856-57c3d2d1-bc73-42d3-b039-aeb4d2b14734-186.jpg" height={700} alt="Third slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://theme.hstatic.net/200000405593/1000757505/14/type2banner_type_2.jpg?v=3845" height={700} alt="Four slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="https://file.hstatic.net/1000230642/collection/web_banner___phien_ban_40_nam_dcc89c653e48402e9d9b5d22b29612b9.png" height={700} alt="Four slide" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleFade" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleFade" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="sr-only">Next</span>
                </a>
            </div>
        );
    }
}

export default Sliderr;