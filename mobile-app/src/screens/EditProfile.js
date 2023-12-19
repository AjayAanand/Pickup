import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    View,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';
import { Icon, Button, Input } from 'react-native-elements'
import { colors } from '../common/theme';
import ActionSheet from "react-native-actions-sheet";
import i18n from 'i18n-js';
var { height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import { api, FirebaseContext } from 'common';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Footer from '../components/Footer';
import { FontAwesome5 } from '@expo/vector-icons';

export default function EditProfilePage(props) {
    const { config } = useContext(FirebaseContext);
    const {
        updateProfile
    } = api;
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const settings = useSelector(state => state.settingsdata.settings);
    const [profileData, setProfileData] = useState(null);
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const actionSheetRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [capturedImageBack, setCapturedImageback] = useState(null);
    const [capturedIdImage, setCapturedIdImage] = useState(null);
    const [tslCapturedImage, setTslCapturedImage] = useState(null);
    const [p_endoursmen_front_CapturedImage, setP_endoursmen_front_CapturedImage] = useState(null);
    const [p_endoursmen_back_CapturedImage, setP_endoursmen_back_CapturedImage,] = useState(null);
    const [cofCapturedImgae, setCofCapturedImage] = useState(null);
    const [vehicleRegistrationCapturedImage, setVehicleRegistrationCapturedImage] = useState(null);
    const [vehicleInsuranceCapturedImage, setVehicleInsuranceCapturedImage] = useState(null);
    const [airportAccessCardCapturedImage, setAirportAccessCardCapturedImage] = useState(null);
    const [check, setCheck] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateCalled, setUpdateCalled] = useState(false);
    const fromPage = props.route.params && props.route.params.fromPage ? props.route.params.fromPage : null;

    const onPressBack = () => {
        if (fromPage == 'DriverTrips' || fromPage == 'Map' || fromPage == 'Wallet') {
            props.navigation.navigate('TabRoot', { screen: fromPage });
        } else {
            props.navigation.goBack()
        }
    }

    useEffect(() => {
        if (auth.profile && auth.profile.uid) {
            setProfileData({ ...auth.profile });
            if (updateCalled) {
                setLoading(false);
                Alert.alert(
                    t('alert'),
                    t('profile_updated'),
                    [
                        {
                            text: t('ok'), onPress: () => {
                                onPressBack();
                            }
                        }
                    ],
                    { cancelable: true }
                );
                setUpdateCalled(false);
            }
        }
    }, [auth.profile, updateCalled]);

    const showActionSheet = (text) => {
        setCheck(text);
        actionSheetRef.current?.setModalVisible(true);
    }

    const [state, setState] = useState({
        licenseImage: null,
        licenseImageBack: null,
        verifyIdImage: null
    });


    const uploadImage = () => {
        return (
            <ActionSheet ref={actionSheetRef}>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderColor: colors.CONVERTDRIVER_TEXT, borderBottomWidth: 1, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('CAMERA', ImagePicker.launchCameraAsync) }}
                >
                    <Text style={{ color: colors.CAMERA_TEXT, fontWeight: 'bold' }}>{t('camera')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, borderBottomWidth: 1, borderColor: colors.CONVERTDRIVER_TEXT, height: 60, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { _pickImage('MEDIA', ImagePicker.launchImageLibraryAsync) }}
                >
                    <Text style={{ color: colors.CAMERA_TEXT, fontWeight: 'bold' }}>{t('medialibrary')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '90%', alignSelf: 'center', paddingLeft: 20, paddingRight: 20, height: 50, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => { actionSheetRef.current?.setModalVisible(false); }}>
                    <Text style={{ color: 'red', fontWeight: 'bold' }}>{t('cancel')}</Text>
                </TouchableOpacity>
            </ActionSheet>
        )
    }

    const _pickImage = async (permissionType, res) => {
        var pickFrom = res;
        let permisions;
        if (permissionType == 'CAMERA') {
            permisions = await ImagePicker.requestCameraPermissionsAsync();
        } else {
            permisions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        const { status } = permisions;

        if (status == 'granted') {

            let result = await pickFrom({
                allowsEditing: true,
                aspect: [4, 3]
            });

            actionSheetRef.current?.setModalVisible(false);

            if (!result.canceled) {
                if (check == 0) {
                    setCapturedImage(result.assets[0].uri);
                }
                else if (check == 1) {
                    setCapturedImageback(result.assets[0].uri);
                }
                else if (check == 2) {
                    setCapturedIdImage(result.assets[0].uri);
                }
                else if (check == 3) {
                    setTslCapturedImage(result.assets[0].uri);
                }
                else if (check == 4) {
                    setP_endoursmen_front_CapturedImage(result.assets[0].uri);
                }
                else if (check == 5) {
                    setP_endoursmen_back_CapturedImage(result.assets[0].uri);
                }
                else if (check == 6) {
                    setCofCapturedImage(result.assets[0].uri);
                }
                else if (check == 7) {
                    setVehicleRegistrationCapturedImage(result.assets[0].uri);
                }
                else if (check == 8) {
                    setVehicleInsuranceCapturedImage(result.assets[0].uri);
                }
                else if (check == 9) {
                    setAirportAccessCardCapturedImage(result.assets[0].uri);
                }

                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        resolve(xhr.response);
                    };
                    xhr.onerror = function () {
                        Alert.alert(t('alert'), t('image_upload_error'));
                    };
                    xhr.responseType = 'blob';
                    xhr.open('GET', result.assets[0].uri, true);
                    xhr.send(null);
                });
                if (blob) {
                    if (check == 0) {
                        setState({ ...state, licenseImage: blob });
                    }
                    else if (check == 1) {
                        setState({ ...state, licenseImageBack: blob });
                    }
                    else if (check == 2) {
                        setState({ ...state, verifyIdImage: blob });
                    }
                    else if (check == 3) {
                        setState({ ...state, tslImage: blob });
                    }
                    else if (check == 4) {
                        setState({ ...state, p_endoursmenImageFront: blob });
                    }
                    else if (check == 5) {
                        setState({ ...state, p_endoursmenImageBack: blob });
                    }
                    else if (check == 6) {
                        setState({ ...state, cofImage: blob });
                    }
                    else if (check == 7) {
                        setState({ ...state, vehicleRegistraionImage: blob });
                    }
                    else if (check == 8) {
                        setState({ ...state, vehicleInsuranceImage: blob });
                    }
                    else if (check == 9) {
                        setState({ ...state, airportAccessCardImage: blob });
                    }
                }
            }
        } else {
            Alert.alert(t('alert'), t('camera_permission_error'))
        }
    }

    const cancelPhoto = () => {
        setCapturedImage(null);
    }

    const cancelPhotoback = () => {
        setCapturedImageback(null);
    }

    const cancelIdPhoto = () => {
        setCapturedIdImage(null);
    }

    const cancelTSLPhoto = () => {
        setTslCapturedImage(null);
    }
    const cancelPendoursmenFrontPhoto = () => {
        setP_endoursmen_front_CapturedImage(null);
    }
    const cancelPendoursmenBackPhoto = () => {
        setP_endoursmen_back_CapturedImage(null);
    }
    const cancelCofPhoto = () => {
        setCofCapturedImage(null);
    }
    const cancelVehicleRegistrationPhoto = () => {
        setVehicleRegistrationCapturedImage(null);
    }
    const cancelVehicleInsurancePhoto = () => {
        setVehicleInsuranceCapturedImage(null);
    }
    const cancelAirportAccessCardPhoto = () => {
        setAirportAccessCardCapturedImage(null);
    }

    const completeSubmit = () => {
        let userData = {
            verifyId: profileData.verifyId ? profileData.verifyId : null
        }
        setUpdateCalled(true);
        if ((auth.profile.usertype == 'driver' && settings.bank_fields) || (auth.profile.usertype == 'customer' && settings.bank_fields && settings.RiderWithDraw) && profileData.bankAccount && profileData.bankAccount.length &&
            profileData.bankCode && profileData.bankCode.length &&
            profileData.bankName && profileData.bankName.length) {
            userData.bankAccount = profileData.bankAccount,
                userData.bankCode = profileData.bankCode,
                userData.bankName = profileData.bankName
        }
        if (auth.profile.usertype == 'driver') {
            if (capturedImage) {
                userData.licenseImage = state ? state.licenseImage : profileData.licenseImage ? profileData.licenseImage : null;
            }
            if (capturedImageBack) {
                userData.licenseImageBack = state ? state.licenseImageBack : profileData.licenseImageBack ? profileData.licenseImageBack : null;
            }
        }
        if (capturedIdImage) {
            userData.verifyIdImage = state ? state.verifyIdImage : profileData.verifyIdImage ? profileData.verifyIdImage : null;
        }
        if (tslCapturedImage) {
            userData.tslImage = state ? state.tslImage : profileData.tslImage ? profileData.tslImage : null;
        }
        if (p_endoursmen_front_CapturedImage) {
            userData.p_endoursmenImageFront = state ? state.p_endoursmenImageFront : profileData.p_endoursmenImageFront ? profileData.p_endoursmenImageFront : null;
        }
        if (p_endoursmen_back_CapturedImage) {
            userData.p_endoursmenImageBack = state ? state.p_endoursmenImageBack : profileData.p_endoursmenImageBack ? profileData.p_endoursmenImageBack : null;
        }
        if (cofCapturedImgae) {
            userData.cofImage = state ? state.cofImage : profileData.cofImage ? profileData.cofImage : null;
        }
        if (vehicleRegistrationCapturedImage) {
            userData.vehicleRegistraionImage = state ? state.vehicleRegistraionImage : profileData.vehicleRegistraionImage ? profileData.vehicleRegistraionImage : null;
        }
        if (vehicleInsuranceCapturedImage) {
            userData.vehicleInsuranceImage = state ? state.vehicleInsuranceImage : profileData.vehicleInsuranceImage ? profileData.vehicleInsuranceImage : null;
        }
        if (airportAccessCardCapturedImage) {
            userData.airportAccessCardImage = state ? state.airportAccessCardImage : profileData.airportAccessCardImage ? profileData.airportAccessCardImage : null;
        }


        dispatch(updateProfile(userData));
    }

    const saveProfile = async () => {
        if (((auth.profile.usertype == 'driver' && settings.bank_fields) || (auth.profile.usertype == 'customer' && settings.bank_fields && settings.RiderWithDraw)) && !(profileData.bankAccount && profileData.bankCode && profileData.bankName)) {
            Alert.alert(t('alert'), t('no_details_error'));
        }
        else {
            setLoading(true);
            completeSubmit();
        }
    }

    const lCom = () => {
        return (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={onPressBack}>
                <FontAwesome5 name="arrow-left" size={24} color={colors.WHITE} />
            </TouchableOpacity>
        );
    }

    React.useEffect(() => {
        props.navigation.setOptions({
            headerLeft: lCom,
        });
    }, [props.navigation]);


    return (
        <View style={{ flex: 1 }}>
            <Footer />
            <View style={{ position: 'absolute', backgroundColor: colors.TRANSPARENT, width: '100%', height: '100%' }}>
                <View style={styles.containerStyle}>
                    <ScrollView style={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
                        {(auth.profile.usertype == 'driver' && settings.bank_fields) || (auth.profile.usertype == 'customer' && settings.bank_fields && settings.RiderWithDraw) ?
                            <View style={styles.textInputContainerStyle}>
                                <Text style={[styles.text1, isRTL ? { textAlign: 'right', marginRight: 30 } : { textAlign: 'left', marginLeft: 7 }]} >{t('bankName')}</Text>
                                <View style={[styles.textInputContainerStyle1, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <View style={styles.iconContainer}>
                                        <MaterialCommunityIcons name="bank-outline" size={24} color={colors.HEADER} />
                                    </View>
                                    <View style={{ width: '75%' }}>
                                        <Input
                                            editable={true}
                                            underlineColorAndroid={colors.TRANSPARENT}
                                            placeholder={t('bankName')}
                                            placeholderTextColor={colors.PROFILE_PLACEHOLDER_TEXT}
                                            value={profileData && profileData.bankName ? profileData.bankName : ''}
                                            keyboardType={'email-address'}
                                            inputStyle={[styles.inputTextStyle, isRTL ? { textAlign: 'right', fontSize: 13, } : { textAlign: 'left', fontSize: 13, }]}
                                            onChangeText={(text) => { setProfileData({ ...profileData, bankName: text }) }}
                                            secureTextEntry={false}
                                            errorStyle={styles.errorMessageStyle}
                                            inputContainerStyle={styles.inputContainerStyle}
                                            containerStyle={[styles.textInputStyle, { marginLeft: 0 }]}
                                        />
                                    </View>
                                </View>
                            </View>
                            : null}
                        {(auth.profile.usertype == 'driver' && settings.bank_fields) || (auth.profile.usertype == 'customer' && settings.bank_fields && settings.RiderWithDraw) ?
                            <View style={styles.textInputContainerStyle}>
                                <Text style={[styles.text1, isRTL ? { textAlign: 'right', marginRight: 30 } : { textAlign: 'left', marginLeft: 7 }]} >{t('bankCode')}</Text>
                                <View style={[styles.textInputContainerStyle1, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <Icon
                                        name='numeric'
                                        type='material-community'
                                        color={colors.PROFILE_PLACEHOLDER_CONTENT}
                                        size={30}
                                        containerStyle={styles.iconContainer}
                                    />
                                    <View style={{ width: '75%' }}>
                                        <Input
                                            editable={true}
                                            underlineColorAndroid={colors.TRANSPARENT}
                                            placeholder={t('bankCode')}
                                            placeholderTextColor={colors.PROFILE_PLACEHOLDER_TEXT}
                                            value={profileData && profileData.bankCode ? profileData.bankCode : ''}
                                            keyboardType={'email-address'}
                                            inputStyle={[styles.inputTextStyle, isRTL ? { textAlign: 'right', fontSize: 13, } : { textAlign: 'left', fontSize: 13, }]}
                                            onChangeText={(text) => { setProfileData({ ...profileData, bankCode: text }) }}
                                            secureTextEntry={false}
                                            errorStyle={styles.errorMessageStyle}
                                            inputContainerStyle={styles.inputContainerStyle}
                                            containerStyle={[styles.textInputStyle, { marginLeft: 0 }]}
                                        />
                                    </View>
                                </View>
                            </View>
                            : null}
                        {(auth.profile.usertype == 'driver' && settings.bank_fields) || (auth.profile.usertype == 'customer' && settings.bank_fields && settings.RiderWithDraw) ?
                            <View style={styles.textInputContainerStyle}>
                                <Text style={[styles.text1, isRTL ? { textAlign: 'right', marginRight: 30 } : { textAlign: 'left', marginLeft: 7 }]} >{t('bankAccount')}</Text>
                                <View style={[styles.textInputContainerStyle1, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <Icon
                                        name='numeric'
                                        type='material-community'
                                        color={colors.PROFILE_PLACEHOLDER_CONTENT}
                                        size={30}
                                        containerStyle={styles.iconContainer}
                                    />
                                    <View style={{ width: '75%' }}>
                                        <Input
                                            editable={true}
                                            underlineColorAndroid={colors.TRANSPARENT}
                                            placeholder={t('bankAccount')}
                                            placeholderTextColor={colors.PROFILE_PLACEHOLDER_TEXT}
                                            value={profileData && profileData.bankAccount ? profileData.bankAccount : ''}
                                            keyboardType={'email-address'}
                                            inputStyle={[styles.inputTextStyle, isRTL ? { textAlign: 'right', fontSize: 13, } : { textAlign: 'left', fontSize: 13, }]}
                                            onChangeText={(text) => { setProfileData({ ...profileData, bankAccount: text }) }}
                                            secureTextEntry={false}
                                            errorStyle={styles.errorMessageStyle}
                                            inputContainerStyle={styles.inputContainerStyle}
                                            containerStyle={[styles.textInputStyle, { marginLeft: 0 }]}
                                        />
                                    </View>
                                </View>
                            </View>
                            : null}

                        {settings && settings.imageIdApproval ?
                            <View style={styles.textInputContainerStyle}>
                                <Text style={[styles.text1, isRTL ? { textAlign: 'right', marginRight: 35 } : { textAlign: 'left', marginLeft: 10 }]} >{t('verify_id')}</Text>
                                <View style={[styles.textInputContainerStyle1, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                    <View style={styles.iconContainer}>
                                        <MaterialCommunityIcons name="cellphone-information" size={24} color={colors.HEADER} />
                                    </View>
                                    <View style={{ width: '75%' }}>
                                        <Input
                                            underlineColorAndroid={colors.TRANSPARENT}
                                            placeholder={t('verify_id')}
                                            placeholderTextColor={colors.PROFILE_PLACEHOLDER_TEXT}
                                            value={profileData && profileData.verifyId ? profileData.verifyId : ''}
                                            keyboardType={'email-address'}
                                            inputStyle={[styles.inputTextStyle, isRTL ? { textAlign: 'right', fontSize: 13, } : { textAlign: 'left', fontSize: 13, }]}
                                            onChangeText={(text) => {
                                                setProfileData({ ...profileData, verifyId: text })
                                            }}
                                            secureTextEntry={false}
                                            errorStyle={styles.errorMessageStyle}
                                            inputContainerStyle={styles.inputContainerStyle}
                                            containerStyle={styles.textInputStyle}
                                        />
                                    </View>
                                </View>
                            </View>
                            : null}

                        {settings && settings.imageIdApproval ?
                            !auth.profile.verifyIdImage ?
                                capturedIdImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelIdPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: capturedIdImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    <Text style={styles.capturePhotoTitle}>{t('upload_verifyIdImage')}</Text>
                                                    :
                                                    <Text style={styles.errorPhotoTitle}>{t('upload_verifyIdImage')}</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('2')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        <Text style={styles.text}>{t('verifyid_image')}</Text>
                                    </View>
                                    {capturedIdImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelIdPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {capturedIdImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('2')}>
                                            <Image source={{ uri: capturedIdImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('2')}>
                                            <Image source={{ uri: auth.profile.verifyIdImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }

                        {auth.profile.usertype == 'driver' && settings.license_image_required ?
                            !auth.profile.licenseImage ?
                                capturedImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: capturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_front')}</Text>
                                                    :
                                                    <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_front')}</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('0')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5 }}>
                                        <Text style={styles.text}>{t('driving_license_font')}</Text>
                                    </View>
                                    {capturedImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {capturedImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('0')}>
                                            <Image source={{ uri: capturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('0')}>
                                            <Image source={{ uri: auth.profile.licenseImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }

                        {auth.profile.usertype == 'driver' && settings.license_image_required ?
                            !auth.profile.licenseImageBack ?
                                capturedImageBack ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPhotoback}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: capturedImageBack }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    :
                                                    <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('1')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        <Text style={styles.text}>{t('driving_license_back')}</Text>
                                    </View>
                                    {capturedImageBack ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPhotoback}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {capturedImageBack ?
                                        <TouchableOpacity onPress={() => showActionSheet('1')}>
                                            <Image source={{ uri: capturedImageBack }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('1')}>
                                            <Image source={{ uri: auth.profile.licenseImageBack }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }

                        {/* ------------ TSL UPLOAD ----------- */}
                        {auth.profile.usertype == 'driver' ?
                            !auth.profile.tslImage ?
                                tslCapturedImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelTSLPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: tslCapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    // <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.capturePhotoTitle}> TSL </Text>
                                                    :
                                                    // <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.errorPhotoTitle}> TSL </Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('3')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        {/* <Text style={styles.text}>{t('driving_license_back')}</Text> */}
                                        <Text style={styles.text}> TSL</Text>
                                    </View>
                                    {tslCapturedImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelTSLPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {tslCapturedImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('3')}>
                                            <Image source={{ uri: tslCapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('3')}>
                                            <Image source={{ uri: auth.profile.tslImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }

                        {/* ------------ P-endoursment Front UPLOAD  ----------- */}

                        {auth.profile.usertype == 'driver' ?
                            !auth.profile.p_endoursmenImageFront ?
                                p_endoursmen_front_CapturedImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPendoursmenFrontPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: p_endoursmen_front_CapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    // <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.capturePhotoTitle}> P-endoursment Front </Text>
                                                    :
                                                    // <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.errorPhotoTitle}> P-endoursment  Front</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('4')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        {/* <Text style={styles.text}>{t('driving_license_back')}</Text> */}
                                        <Text style={styles.text}> P-endoursment  Front</Text>
                                    </View>
                                    {p_endoursmen_front_CapturedImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPendoursmenFrontPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {p_endoursmen_front_CapturedImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('4')}>
                                            <Image source={{ uri: p_endoursmen_front_CapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('4')}>
                                            <Image source={{ uri: auth.profile.p_endoursmenImageFront }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }


                        {/* ------------  P-endoursment Back UPLOAD ----------- */}

                        {auth.profile.usertype == 'driver' ?
                            !auth.profile.p_endoursmenImageBack ?
                                p_endoursmen_back_CapturedImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPendoursmenBackPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: p_endoursmen_back_CapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    // <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.capturePhotoTitle}>P-endoursment Back</Text>
                                                    :
                                                    // <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.errorPhotoTitle}>P-endoursment Back</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('5')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        {/* <Text style={styles.text}>{t('driving_license_back')}</Text> */}
                                        <Text style={styles.text}>P-endoursment Back</Text>
                                    </View>
                                    {p_endoursmen_back_CapturedImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelPendoursmenBackPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {p_endoursmen_back_CapturedImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('5')}>
                                            <Image source={{ uri: p_endoursmen_back_CapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('5')}>
                                            <Image source={{ uri: auth.profile.p_endoursmenImageBack }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }

                        {/* ------------ COF UPLOAD ----------- */}

                        {auth.profile.usertype == 'driver' ?
                            !auth.profile.cofImage ?
                                cofCapturedImgae ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelCofPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: cofCapturedImgae }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    // <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.capturePhotoTitle}>COF</Text>
                                                    :
                                                    // <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.errorPhotoTitle}>COF</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('6')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        {/* <Text style={styles.text}>{t('driving_license_back')}</Text> */}
                                        <Text style={styles.text}>COF</Text>
                                    </View>
                                    {cofCapturedImgae ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelCofPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {cofCapturedImgae ?
                                        <TouchableOpacity onPress={() => showActionSheet('6')}>
                                            <Image source={{ uri: cofCapturedImgae }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('6')}>
                                            <Image source={{ uri: auth.profile.cofImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }


                        {/* ------------ VEHICLE REGISTRATION UPLOAD ----------- */}

                        {auth.profile.usertype == 'driver' ?
                            !auth.profile.vehicleRegistraionImage ?
                                vehicleRegistrationCapturedImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelVehicleRegistrationPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: vehicleRegistrationCapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    // <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.capturePhotoTitle}>VEHICLE REGISTRATION</Text>
                                                    :
                                                    // <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.errorPhotoTitle}>VEHICLE REGISTRATION</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('7')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        {/* <Text style={styles.text}>{t('driving_license_back')}</Text> */}
                                        <Text style={styles.text}>VEHICLE REGISTRATION</Text>
                                    </View>
                                    {vehicleRegistrationCapturedImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelVehicleRegistrationPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {vehicleRegistrationCapturedImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('7')}>
                                            <Image source={{ uri: vehicleRegistrationCapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('7')}>
                                            <Image source={{ uri: auth.profile.vehicleRegistraionImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }


                        {/* ------------ VEHICLE INSURANCE UPLOAD ----------- */}

                        {auth.profile.usertype == 'driver' ?
                            !auth.profile.vehicleInsuranceImage ?
                                vehicleInsuranceCapturedImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelVehicleInsurancePhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: vehicleInsuranceCapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    // <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.capturePhotoTitle}>VEHICLE INSURANCE</Text>
                                                    :
                                                    // <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.errorPhotoTitle}>VEHICLE INSURANCE</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('8')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        {/* <Text style={styles.text}>{t('driving_license_back')}</Text> */}
                                        <Text style={styles.text}>VEHICLE INSURANCE</Text>
                                    </View>
                                    {vehicleInsuranceCapturedImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelVehicleInsurancePhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {vehicleInsuranceCapturedImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('8')}>
                                            <Image source={{ uri: vehicleInsuranceCapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('8')}>
                                            <Image source={{ uri: auth.profile.vehicleInsuranceImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }


                        {/* ------------ Airport Access Card UPLOAD ----------- */}

                        {auth.profile.usertype == 'driver' ?
                            !auth.profile.airportAccessCardImage ?
                                airportAccessCardCapturedImage ?
                                    <View style={styles.imagePosition}>
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelAirportAccessCardPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        <Image source={{ uri: airportAccessCardCapturedImage }} style={styles.photoResult} resizeMode={'cover'} />
                                    </View>
                                    :
                                    <View style={styles.capturePhoto}>
                                        <View>
                                            {
                                                state.imageValid ?
                                                    // <Text style={styles.capturePhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.capturePhotoTitle}>Airport Access Card</Text>
                                                    :
                                                    // <Text style={styles.errorPhotoTitle}>{t('upload_driving_license_back')}</Text>
                                                    <Text style={styles.errorPhotoTitle}>Airport Access Card</Text>
                                            }

                                        </View>
                                        <View style={[styles.capturePicClick, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                            <TouchableOpacity style={styles.flexView1} onPress={() => showActionSheet('9')}>
                                                <View>
                                                    <View style={styles.imageFixStyle}>
                                                        <Image source={require('../../assets/images/camera.png')} resizeMode={'contain'} style={styles.imageStyle2} />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.myView}>
                                                <View style={styles.myView1} />
                                            </View>
                                            <View style={styles.myView2}>
                                                <View style={styles.myView3}>
                                                    <Text style={styles.textStyle}>{t('image_size_warning')}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                :
                                <View style={styles.imagePosition}>
                                    <View style={{ padding: 5, marginTop: 5 }}>
                                        {/* <Text style={styles.text}>{t('driving_license_back')}</Text> */}
                                        <Text style={styles.text}>Airport Access Card</Text>
                                    </View>
                                    {airportAccessCardCapturedImage ?
                                        <TouchableOpacity style={styles.photoClick} onPress={cancelAirportAccessCardPhoto}>
                                            <Image source={require('../../assets/images/cross.png')} resizeMode={'contain'} style={styles.imageStyle} />
                                        </TouchableOpacity>
                                        : null}

                                    {airportAccessCardCapturedImage ?
                                        <TouchableOpacity onPress={() => showActionSheet('9')}>
                                            <Image source={{ uri: capturedImageBack }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => showActionSheet('9')}>
                                            <Image source={{ uri: auth.profile.airportAccessCardImage }} style={styles.photoResult} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    }
                                </View>
                            : null
                        }


                        <View style={styles.buttonContainer}>
                            <Button
                                loading={loading}
                                onPress={saveProfile}
                                title={t('update_button')}
                                titleStyle={styles.buttonTitle}
                                buttonStyle={[styles.registerButton, { backgroundColor: colors.BLACK }]}
                            />
                        </View>
                        <View style={styles.gapView} />
                    </ScrollView>
                </View>
            </View>
            {
                uploadImage()
            }
        </View>

    );

}


const styles = StyleSheet.create({
    pickerStyle: {
        color: colors.HEADER,
        width: 200,
        fontSize: 15,
        height: 40,
        marginBottom: 27,
        margin: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.HEADER,

    },
    container: {
        height: '100%',
        width: '100%',
    },
    vew: {
        borderTopLeftRadius: 130,
        height: '100%',
        alignItems: 'flex-end'
    },
    textInputContainerStyle: {
        width: '100%',
        height: 82,
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        backgroundColor: colors.WHITE
    },

    textInputContainerStyle1: {
        width: '100%',
        height: 60,
        borderRadius: 10,
        marginVertical: -3,
        backgroundColor: colors.WHITE,
        alignItems: 'center'
    },
    vew1: {
        height: '100%',
        borderBottomRightRadius: 120,
        overflow: 'hidden',
        backgroundColor: colors.WHITE,
        width: '100%'
    },
    textInputStyle: {
    },
    inputContainerStyle: {
        width: "100%",
    },
    iconContainer: {
        width: '15%',
        alignItems: 'center'
    },
    gapView: {
        height: 40,
        width: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 40
    },
    registerButton: {
        width: 180,
        height: 50,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        marginTop: 30,
        borderRadius: 15,
    },
    buttonTitle: {
        fontSize: 16,
    },
    inputTextStyle: {
        color: colors.HEADER,
        fontSize: 13,
        height: 32,
    },
    errorMessageStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 0
    },
    containerStyle: {
        flexDirection: 'column',
        width: '100%'
    },
    logo: {
        width: '65%',
        justifyContent: "center",
        height: '15%',
        borderBottomRightRadius: 150,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 5,
        marginBottom: 5,
    },
    headerStyle: {
        fontSize: 25,
        color: colors.WHITE,
        flexDirection: 'row',
        width: '80%'
    },
    imagePosition: {
        position: 'relative'
    },
    imageStyle: {
        width: 30,
        height: height / 15
    },
    photoResult: {
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        marginLeft: 20,
        marginRight: 20,
        paddingTop: 15,
        paddingBottom: 10,
        marginTop: 15,
        width: '80%',
        height: height / 4
    },
    capturePhoto: {
        width: '60%',
        height: 110,
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        backgroundColor: colors.WHITE
    },
    capturePhotoTitle: {
        color: colors.BLACK,
        fontSize: 14,
        textAlign: 'center',
        paddingBottom: 15,

    },
    errorPhotoTitle: {
        color: colors.RED,
        fontSize: 13,
        textAlign: 'center',
        paddingBottom: 15,
    },
    photoClick: {
        paddingRight: 48,
        position: 'absolute',
        zIndex: 1,
        marginTop: 18,
        alignSelf: 'flex-end'
    },
    capturePicClick: {
        backgroundColor: colors.WHITE,
        flexDirection: 'row',
        position: 'relative',
        zIndex: 1
    },
    imageStyle: {
        width: 30,
        height: height / 15
    },
    flexView1: {
        flex: 12
    },
    imageFixStyle: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle2: {
        width: 150,
        height: height / 15
    },
    myView: {
        flex: 2,
        height: 50,
        width: 1,
        alignItems: 'center'
    },
    myView1: {
        height: height / 18,
        width: 1.5,
        backgroundColor: colors.CONVERTDRIVER_TEXT,
        alignItems: 'center',
        marginTop: 10
    },
    myView2: {
        flex: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    myView3: {
        flex: 2.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    segmentcontrol: {
        color: colors.WHITE,
        fontSize: 18,
        fontFamily: "Roboto-Regular",
        marginTop: 0,
        alignSelf: "center",
        height: 50
    },
    text1: {
        fontSize: 17,
        left: 10,
        color: colors.PROFILE_PLACEHOLDER_CONTENT,
        fontFamily: 'Roboto-Bold',
        marginTop: 5
    },
    text: {
        color: colors.BLACK,
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',

    },
});
