import React from 'react';
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import "../style/DropdownCuisine.css";

export default class DropDownCrusine extends React.Component {
    constructor(props) {
        super(props);
        const Crusines = ['Afghan',
        'American',
        'African',
        'Arabian',
        'Argentine',
        'Armenian',
        'Australian',
        'Austrian',
        'Bangladeshi',
        'Barbeque',
        'Basque',
        'Belgian',
        'Brasseries',
        'Brazilian',
        'British',
        'Buffets',
        'Bulgarian',
        'Burgers',
        'Burmese',
        'Cafes',
        'Cafeteria',
        'Cambodian',
        'Caribbean ',
        'Chinese',
        'Creperies',
        'Cuban',
        'Czech',
        'Delis',
        'Diners',
        'Eritrean',
        'Ethiopian',
        'Filipino',
        'Fondue',
        'French',
        'Gastropubs',
        'Georgian',
        'German',
        'Greek',
        'Guamanian',
        'Halal',
        'Hawaiian',
        'Himalayan',
        'Nepalese',
        'Honduran',
        'Hungarian',
        'Iberian',
        'Indian',
        'Indonesian',
        'Irish',
        'Italian',
        'Japanese',
        'Kebab',
        'Korean',
        'Kosher',
        'Laotian',
        'Malaysian',
        'Mediterranean',
        'Mexican',
        'Egyptian',
        'Lebanese',
        'Mongolian',
        'Moroccan',
        'Nicaraguan',
        'Pakistani',
        'Peruvian',
        'Polish',
        'Polynesian',
        'Portuguese',
        'Poutineries',
        'Russian',
        'Scandinavian',
        'Scottish',
        'Seafood',
        'Singaporean',
        'Slovakian',
        'Somali',
        'Soup',
        'Southern',
        'Spanish',
        'Steakhouses',
        'Syrian',
        'Taiwanese',
        'Thai',
        'Turkish',
        'Ukrainian',
        'Uzbek',
        'Vegan',
        'Vegetarian',
        'Vietnamese'];
        this.state={
            CrusinesNames:Crusines.map((crusine, i)=> ({
                key: i, 
                text: crusine, 
                value: crusine.toUpperCase(), 
            })),
        }
    }
    
    



    render() { 
        return <Dropdown placeholder="Choose your Cuisine"  class="custom"
        // style={{height: '30px', width : '465px',   left: "640px", top: "230px"}}
        style={{height: '30px', width : '465px',left:"270px", }}
        fluid
        multiple
        search
        selection
        options={this.state.CrusinesNames} 
        onChange={this.props.onInputCrusineChange}
        />;
    }
}

