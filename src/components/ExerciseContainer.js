import React, { Component } from 'react';
import fire from './Fire';

class ExerciseContainer extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             exercise: this.props.match.params.name,
             id: this.props.match.params.id,
             description: '',
             vid_url: '',
             active_programs: 0,
             uses: 0,
             rating: 0
        }
    }
    

    componentDidMount() {
        let database = fire.database();
        database.ref('exercises/').once('value').then((snap) => {
            snap.forEach((item) => {
                if(item.val().id == this.state.id){
                    this.setState({
                        description: item.val().description,
                        vid_url: item.val().vid_url,
                        active_programs: item.val().active_programs,
                        uses: item.val().uses,
                        rating: item.val().rating,
                    })
                }
                
            });
        });
    }

    getIdFromVidUrl() {
        const embed = 'https://www.youtube.com/embed/';
        let vid_id = this.state.vid_url.substring(this.state.vid_url.lastIndexOf("v=")+2,this.state.vid_url.length);
        let vid_embed = embed.concat(vid_id);
        return vid_embed;
    }

    render() {
        console.log(this.props.match);
        const { exercise, description, vid_url, active_programs, uses, rating } = this.state;
        let vid_embed = null;
        vid_url ? (vid_embed = this.getIdFromVidUrl()) : vid_embed = null;
        
        return (
            <div className='exercisedetail-background'>
                <div className='exercisedetail-container'>
                    <div className='exercisedetail-heading'>
                        {exercise}
                    </div>
                    <div className='exercisedetail-description'>
                        {description}
                    </div>
                    <div className='exercisedetail-vid'>
                        {
                            vid_embed ? (<iframe src={vid_embed} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            ) : (<div>No video</div>
                            )
                        }
                    </div>
                    <div className='exercisedetail-stats'>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Active Programs:</td>
                                    <td>{active_programs}</td>
                                </tr>
                                <tr>
                                    <td>Uses:</td>
                                    <td>{uses}</td>
                                </tr>
                                <tr>
                                    <td>Rating:</td>
                                    <td>{rating}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExerciseContainer