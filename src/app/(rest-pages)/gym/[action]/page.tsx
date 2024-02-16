/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loader from '@/components/common/Loader';
import adminGymAddEditValidation from '@/validation/adminGymAddEditValidation';
import './fonts.css';
import LogoIcon from '@/assets/images/logo-upload-icon.png';
import {
  capitalize,
  ErrorToast,
  SuccessToast,
  getFileType,
  capitalizeFirstWord,
  FONT_TYPE,
  FONT_SIZE,
  FONT_PREVIEW_DATA,
  STATUS,
} from '@/lib/utils';
import axios from 'axios';

import GymComponent from '@/components/PageComponents/GymComps';

interface PerformActionsOnGymProps {
  params: {
    id: any;
    action: string;
  };
}

const PerformActionsOnGym = ({ params }: PerformActionsOnGymProps) => {
  const action = params.action;
  const router = useRouter();

  const imageRef = useRef(null);
  const selectRef = useRef(null);
  const [error, setError] = useState({});
  const [selectedFile, setSelectedFile] = useState({} as any);
  const [isView, setIsView] = useState(false);
  const [preview, setPreview] = useState('');
  const [userFontType, setUserFontType] = useState<any[]>([]);
  const [selectedWorkoutMenu, setWorkoutSelectedMenu] = useState<any>({});
  const [selectedSectionMenu, setSectionSelectedMenu] = useState<any>({});
  const [selectedMovementMenu, setMovementSelectedMenu] = useState<any>({});

  const [userFontSize, setUserFontSize] = useState<any[]>([]);
  const [selectedSizeMenu, setSelectedSizeMenu] = useState<any>({});

  const [previewFontData, setPreviewFontData] = useState<{
    header: {
      fontSize: string;
      fontWeight: string;
    };
    subheader: {
      fontSize: string;
      fontWeight: string;
    };
    description: {
      fontSize: string;
      fontWeight: string;
    };
  }>(FONT_PREVIEW_DATA.medium);

  const [pages, setPages] = useState([
    { name: 'Gym', href: '/gym' },
    { name: `${capitalizeFirstWord(action)}`, href: `/gym/${action}` },
  ]);
  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    address: '',
    domain_name: '',
    about_us: '',
    contact_us: '',
    theme: '#000000',
    default_workout_count: 5,
    status: 1,
    workoutFontStyle: 'roboto_sans',
    sectionFontStyle: 'roboto_sans',
    movementFontStyle: 'roboto_sans',
    fontSize: 'medium',
  });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { errors, isValid } = adminGymAddEditValidation(form);
    if (isValid) {
      setLoader(true);
      const payload = {
        id: form.id,
        name: capitalize(form.name),
        logo_url: selectedFile?.type ? getFileType(selectedFile) : null,
        address: form.address,
        domain_name: form.domain_name,
        about_us: form.about_us,
        contact_us: form.contact_us,
        theme: form.theme,
        default_workout_count: parseInt(form.default_workout_count.toString()),
        status: `${form.status}`,
        workout_font_style: selectedWorkoutMenu.key || form.workoutFontStyle,
        section_font_style: selectedSectionMenu.key || form.sectionFontStyle,
        movement_font_style: selectedMovementMenu.key || form.movementFontStyle,
        // section_font_style:
        font_size: selectedSizeMenu.name || form.fontSize,
      };
      try {
        const addEditGymRes: any = axios.post('/api/admin/gym', payload);
        const response = addEditGymRes.data;
        if (response) {
          if (response?.data?.meta?.code === 1) {
            if (response?.data?.meta?.logo_upload_url?.uploadURL) {
              axios
                .put(
                  response?.data?.meta?.logo_upload_url?.uploadURL,
                  selectedFile,
                  {
                    headers: {
                      'content-type': `${selectedFile?.type?.split('/')[0]}/${
                        selectedFile?.name?.split('.')[1]
                      }`,
                    },
                  }
                )
                .then((resp) => {
                  if (resp?.status === 200) {
                    setLoader(false);
                    SuccessToast(response?.data?.meta?.message);
                    router.push('/gym');
                  }
                })
                .catch(() => {
                  ErrorToast('Something went wrong');
                });
            } else {
              setLoader(false);
              SuccessToast(response?.data?.meta?.message);
              router.push('/gym');
            }
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            ErrorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        }
      } catch (error: any) {
        setLoader(false);
        ErrorToast('Something went wrong', error);
      }
    } else {
      setLoader(false);
      setError(errors);
    }
  };

  const handleChange = (e: any) => {
    setError((prevState) => ({
      ...prevState,
      [e.target.name]: '',
    }));

    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const radioHandler = (e: any) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: parseInt(value),
    }));
  };

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e?.target?.files[0]) {
      if (!e?.target?.files[0].name.match(/\.(jpg|jpeg|png)$/i)) {
        ErrorToast(
          `The specified file ${e?.target?.files[0].name} could not be uploaded. Please upload valid image.`
        );
      } else {
        setSelectedFile(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setPreview('');
    }
  };

  const handleWorkOutMenuChange = (menu: any) => {
    if (menu) {
      setWorkoutSelectedMenu(menu);
    }
  };

  const handleSectionMenuChange = (menu: any) => {
    if (menu) {
      setSectionSelectedMenu(menu);
    }
  };

  const handleMovementChange = (menu: any) => {
    if (menu) {
      setMovementSelectedMenu(menu);
    }
  };

  const handleSizeMenuChange = (menu: { name: string }) => {
    if (menu) {
      setSelectedSizeMenu(menu);
      if (menu.name === 'small') {
        setPreviewFontData(FONT_PREVIEW_DATA.small);
      } else if (menu.name === 'medium') {
        setPreviewFontData(FONT_PREVIEW_DATA.medium);
      } else if (menu.name === 'large') {
        setPreviewFontData(FONT_PREVIEW_DATA.large);
      }
    }
  };

  const addFontList = () => {
    setWorkoutSelectedMenu(FONT_TYPE[0]);
    setSectionSelectedMenu(FONT_TYPE[0]);
    setMovementSelectedMenu(FONT_TYPE[0]);
    setUserFontType(FONT_TYPE);
    setSelectedSizeMenu(FONT_SIZE[1]);
    setUserFontSize(FONT_SIZE);
  };

  const editFontList = (data: {
    workout_font_style: string;
    section_font_style: string;
    movement_font_style: string;
    font_size: string;
  }) => {
    const matchedWorkoutFont = FONT_TYPE.find(
      (font) => font.key === data.workout_font_style
    );

    const prevWorkoutSelectedMenu =
      matchedWorkoutFont &&
      FONT_TYPE.filter((itx) => itx.name === matchedWorkoutFont.name);
    prevWorkoutSelectedMenu &&
      setWorkoutSelectedMenu(prevWorkoutSelectedMenu[0]);

    const matchedSectionFont = FONT_TYPE.find(
      (font) => font.key === data.section_font_style
    );

    const prevSectionSelectedMenu =
      matchedSectionFont &&
      FONT_TYPE.filter((itx) => itx.name === matchedSectionFont.name);
    prevSectionSelectedMenu &&
      setSectionSelectedMenu(prevSectionSelectedMenu[0]);

    const matchedMovementFont = FONT_TYPE.find(
      (font) => font.key === data.movement_font_style
    );

    const prevMovementSelectedMenu =
      matchedMovementFont &&
      FONT_TYPE.filter((itx) => itx.name === matchedMovementFont.name);
    prevMovementSelectedMenu &&
      setMovementSelectedMenu(prevMovementSelectedMenu[0]);

    // const newData = FONT_TYPE.slice(1);
    setUserFontType(FONT_TYPE);

    const prevSelectedSizeMenu = FONT_SIZE.filter(
      (itx) => itx.name === data.font_size
    );
    setSelectedSizeMenu(prevSelectedSizeMenu[0]);

    setUserFontSize(FONT_SIZE);
    setPreviewFontData(
      FONT_PREVIEW_DATA[data.font_size as keyof typeof FONT_PREVIEW_DATA]
    );
  };

  const viewFontList = (data: {
    workout_font_style: string;
    section_font_style: string;
    movement_font_style: string;
    font_size: string | number;
  }) => {
    const matchedWorkOutFont = FONT_TYPE.find(
      (font) => font.key === data.workout_font_style
    );
    const defaultWorkoutMenu = [
      { name: matchedWorkOutFont?.name, value: matchedWorkOutFont?.name },
    ];
    const matchedSectionFont = FONT_TYPE.find(
      (font) => font.key === data.section_font_style
    );
    const defaultSectionMenu = [
      { name: matchedSectionFont?.name, value: matchedSectionFont?.name },
    ];
    const matchedMovementFont = FONT_TYPE.find(
      (font) => font.key === data.movement_font_style
    );
    const defaultMovementMenu = [
      { name: matchedMovementFont?.name, value: matchedMovementFont?.name },
    ];
    setWorkoutSelectedMenu(defaultWorkoutMenu[0]);
    setSectionSelectedMenu(defaultSectionMenu[0]);
    setMovementSelectedMenu(defaultMovementMenu[0]);
    setUserFontType(defaultWorkoutMenu);

    const defaultSizeMenu = [{ name: data.font_size, value: data.font_size }];
    setSelectedSizeMenu(defaultSizeMenu[0]);
    setUserFontSize(defaultSizeMenu);
    setPreviewFontData(
      FONT_PREVIEW_DATA[data.font_size as keyof typeof FONT_PREVIEW_DATA]
    );
  };

  const setActionTitle = (action: string) => {
    switch (action) {
      case 'add':
        return 'Add Gym';
      case 'edit':
        return 'Edit Gym';
      case 'view':
        return 'Gym Details';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (action === 'view' || action === 'edit') {
      setLoader(true);
      setPages([
        { name: 'Gym', href: '/gym' },
        {
          name: `${setActionTitle(action)}`,
          href: `/gym/${action}`,
        },
      ]);
      setIsView(action === 'view');
      try {
        const getGymIdRes: any = axios.get(`/api/admin/gym/${params.id}`);
        const response = getGymIdRes.data;
        if (response) {
          const singleGymData = response?.data?.data;
          if (response?.data?.meta?.code === 1) {
            setForm({
              id: singleGymData.id || '',
              name: singleGymData.name || '',
              address: singleGymData.address || '',
              domain_name: singleGymData.domain_name || '',
              about_us: singleGymData.about_us || '',
              contact_us: singleGymData.contact_us || '',
              theme: singleGymData.theme || '',
              default_workout_count: parseInt(
                singleGymData.default_workout_count
              ),
              status: parseInt(singleGymData.status),
              fontSize: singleGymData.font_size || 'medium',
              workoutFontStyle:
                singleGymData.workout_font_style || 'roboto_sans',
              sectionFontStyle:
                singleGymData.section_font_style || 'roboto_sans',
              movementFontStyle:
                singleGymData.movement_font_style || 'roboto_sans',
            });
            if (action === 'view') {
              viewFontList(singleGymData);
            }
            if (action === 'edit') {
              editFontList(singleGymData);
            }
            setPreview(singleGymData?.logo_url);
            setLoader(false);
          } else if (response?.code === 401) {
            setLoader(false);
            ErrorToast(response?.message);
          } else if (response?.data?.meta?.code === 0) {
            setLoader(false);
            ErrorToast(response?.data?.meta?.message);
          } else {
            setLoader(false);
          }
        }
      } catch (error: any) {
        setLoader(false);
        ErrorToast(error);
      }
    }
  }, []);

  useEffect(() => {
    if (action === 'add') addFontList();
  }, [action]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        selectRef.current &&
        (selectRef.current as HTMLElement).contains(event.target)
      ) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  useEffect(() => {
    const handleKeyDown = (e: { key: string }) => {
      if (e.key === 'Escape') {
        setIsColorPickerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isColorPickerOpen]);

  return (
    <>
      {loader && <Loader />}
      <Breadcrumb pageList={pages} />
      {!loader && (
        <>
          <GymComponent
            form={form}
            error={error}
            isView={isView}
            MainStatus={STATUS}
            action={action}
            radioHandler={radioHandler}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            onSelectFile={onSelectFile}
            selectRef={selectRef}
            imageRef={imageRef}
            loader={loader}
            preview={preview}
            LogoIcon={LogoIcon}
            isColorPickerOpen={isColorPickerOpen}
            setIsColorPickerOpen={setIsColorPickerOpen}
            setForm={setForm}
            userFontType={userFontType}
            selectedWorkoutMenu={selectedWorkoutMenu}
            handleWorkOutMenuChange={handleWorkOutMenuChange}
            selectedSectionMenu={selectedSectionMenu}
            handleSectionMenuChange={handleSectionMenuChange}
            selectedMovementMenu={selectedMovementMenu}
            handleMovementChange={handleMovementChange}
            userFontSize={userFontSize}
            selectedSizeMenu={selectedSizeMenu}
            handleSizeMenuChange={handleSizeMenuChange}
            previewFontData={previewFontData}
          />
        </>
      )}
    </>
  );
};

export default PerformActionsOnGym;
