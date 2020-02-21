import { StyleSheet } from 'react-native';
import ToolbarHeader from './Typography'
export const FormStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
      },
      headerColor: ToolbarHeader,
      InputSection: {
        flexDirection: "column",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5
      },
      largeButtonText:{
        fontSize: 20,
        fontWeight: 'bold',
        color:'#FFF',
        textAlign:'center'
      }
})