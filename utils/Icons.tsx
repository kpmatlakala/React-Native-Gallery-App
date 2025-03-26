
import React from "react";
import type { PropsWithChildren } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";

// Define IconProps using `type` with optional `size`
type IconProps = {
    name: string;
    size?: number; // size is optional, will default to 30 if not passed
    color?: string; // Optional color property
  };

//   <Icon name="google" size={32} color = "white" />
  

  const Icons = ({ name, size = 30, color = 'white' }: IconProps) => {
    
    switch (name) 
    {
        case "google":
            return <Icon name="google" size={size} color={color} />
            break;

        case "video":
            return <Icon name="video" size={size} color={color} />
            break;

        case "camera":
            return <Icon name="camera" size={size} color={color} />
            break;

        case "camera-rotate":
            return <Icon name="sync-alt" size={size} color={color} />
            break;

        case "microphone":
            return <Icon name="microphone" size={size} color={color} />
            break;

        case "play":
            return <Icon name="play" size={size} color={color} />
            break;

        case "stop":
            return <Icon name="stop" size={size} color={color} />
            break;

        case "pause":
            return <Icon name="pause" size={size} color={color} />
            break;
        
        case "rename":
            return <Icon name="i-cursor" size={size} color={color} />
            break;

        case "edit":
            return <Icon name="pen" size={size} color={color} />
            break;            
        
        case "delete":
            return <Icon name="trash" size={size} color={color} />
            break;

        case "close":
            return <Icon name="xmark" size={size} color={color} />
            break; 

        case "bars":
            return <Icon name="bars" size={size} color={color} />
            break;

        case "left-arrow":
            return <Icon name="caret-left" size={size} color={color} />
            break;

        case "right-arrow":
            return <Icon name="caret-right" size={size} color={color} />
            break;

        case "code":
            return <Icon name="code" size={size} color={color} />
            break;

        case "back":
            return <Icon name="chevron-left" size={size} color={color} />
            break;

        case "folder":
            return <Icon name="folder" size={size} color={color} />
            break;
        
        case "folder-open":
            return <Icon name="folder-open" size={size} color={color} />
            break;

        case "image":
            return <Icon name="image" size={size} color={color} />
            break;
        
        case "images":
            return <Icon name="images" size={size} color={color} />
            break;

        case "file-image":
            return <Icon name="file-image" size={size} color={color} />
            break;
        
        // case "share":
        //     return <Icon name="share" size={size} color={color} />
        //     break;
            
        case "share":
            return <Icon name="share-nodes" size={size} color={color} />
            break;

        case "location":
            return <Icon name="location-dot" size={size} color={color} />
            break;            
         
        case "heart":
            return <Icon name="heart" size={size} color={color} />
            break;

        case "info":
            return <Icon name="info" size={size} color={color} />
            break;  

        case "search":
            return <Icon name="magnifying-glass" size={size} color={color} />
            break;

        case "v-dots":
            return <Icon name="ellipsis-vertical" size={size} color={color} />
            break;
            

        default:
            return <Icon name="bullseye" size={30} color="white" />
            break;
        }
}

export default Icons;

