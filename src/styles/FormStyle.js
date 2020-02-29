import { StyleSheet } from "react-native";
import ToolbarHeader from "./Typography";
export const FormStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  headerColor: {
    textTransform: "capitalize",
    color: "#212B36",
    fontWeight: "800",
    fontFamily: "Roboto",
    fontSize: 18,
    backgroundColor: "#F8F9FA"
  },
  InputSection: {
    flexDirection: "column",
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  loginInputSection: {
    flexDirection: "column",
    padding: 0,
    margin: 0
  },
  fileInputSection: {
    flex:1,
    flexDirection: "row",
    justifyContent: 'space-between',
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 4,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  attachIcon:{
    fontSize: 25, color: '#637381'
  },
  fileSection:{
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 4,
    marginLeft: 12,
    marginRight: 12,
  },
  inputLabel:{
    color: '#637381',
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Roboto'
  },
  largeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center"
  }
});
