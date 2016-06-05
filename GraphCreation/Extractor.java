import com.opencsv.CSVWriter;

import java.io.FileWriter;
import java.io.IOException;

/**
 * Created by antonio on 04/06/16.
 */

import java.io.InputStream;
import java.net.URL;
import java.util.*;

import javax.xml.parsers.ParserConfigurationException;

import org.xml.sax.SAXException;
import de.topobyte.osm4j.core.access.OsmIterator;
import de.topobyte.osm4j.core.model.iface.EntityContainer;
import de.topobyte.osm4j.core.model.iface.EntityType;
import de.topobyte.osm4j.core.model.iface.OsmNode;
import de.topobyte.osm4j.core.model.util.OsmModelUtil;
import de.topobyte.osm4j.xml.dynsax.OsmXmlIterator;

import java.io.BufferedReader;
import java.io.InputStreamReader;
//import org.json.JSONObject;


public class Extractor {
    public void extractData(String inputFilename, String outputFilename)throws ParserConfigurationException,SAXException, IOException {
        // Create a reader for XML data
        OsmIterator iterator = new OsmXmlIterator(inputFilename, false);

        //Create writerNodes
        CSVWriter writerNodes=null, writerEdges = null;
        try {
            writerNodes = new CSVWriter(new FileWriter(outputFilename+"_nodes"), ',');
            writerEdges = new CSVWriter(new FileWriter(outputFilename+"_edges"), ',');
        } catch (IOException e) {
            e.printStackTrace();
        }

        List<String> placesInTheFile = new ArrayList<String>();
        Map<String, List> placesType = new HashMap<String, List>();
        List<String> list;


        //create list of place types of type tourism
        list = new ArrayList<String>();
        list.add("artwork");
        list.add("gallery");
        list.add("museum");
        list.add("viewpoint");
        placesType.put("tourism", list);

        //create list of placesInTheFile of type historic
        list = new ArrayList<String>();
        list.add("monument");
        list.add("memorial");
        list.add("monastery");
        list.add("ruins");
        list.add("tomb");
        placesType.put("historic", list);

        //create list of placesInTheFile of type building
        list = new ArrayList<String>();
        list.add("cathedral");
        list.add("chapel");
        list.add("church");
        list.add("mosque");
        list.add("temple");
        list.add("synagogue");
        list.add("stadium");
        placesType.put("building", list);

        int c=0;
        System.out.println("Numero cicli = "+c);
        // Iterate contained entities
        for (EntityContainer container : iterator) {

            // Only use nodes
            if (container.getType() == EntityType.Node) {

                OsmNode node = (OsmNode) container.getEntity();

                Map<String, String> tags = OsmModelUtil.getTagsAsMap(node);

                Iterator<String> it = placesType.keySet().iterator();
                boolean found = false;
                while(it.hasNext() && !found ){
                    String key = it.next();
                    if(tags.containsKey(key)){
                        String tag = tags.get(key);
                        found=true;
                        if(placesType.get(key).contains(tag)){

                            String[] entries =null;
                            try {
                                /*
                                Entries structure:
                                type,nodeid,name,latitude,longitude,description
                                 */

                                String nodeID = String.valueOf(node.getId());
                                placesInTheFile.add(nodeID);

                                entries = new String[6];
                                String name=tags.get("name");
                                entries[0] = tag;
                                entries[1] = nodeID;
                                entries[2] = name;
                                entries[3] = String.valueOf(node.getLatitude());
                                entries[4] = String.valueOf(node.getLongitude());
                                entries[5] = this.wikiDescription(name);
                                writerNodes.writeNext(entries);

                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    //c++;
                }

            }
        }
        for(String source : placesInTheFile)
            for(String destination : placesInTheFile)
                    if(!source.equals(destination))
                        writerEdges.writeNext(new String(source+"#"+destination).split("#"));
         //String[] entries = "first#second#third".split("#");




        //System.out.println("Numero cicli = "+c);
        try {
            writerNodes.close();
            writerEdges.close();


        } catch (NullPointerException  e) {
            e.printStackTrace();
        }
    }



    public void extractData(String inputFilename)throws ParserConfigurationException,SAXException, IOException {

        this.extractData(inputFilename, inputFilename+"_output");
    }


    public String wikiDescription(String name){
        String text = "";
        try {
            URL url = new URL("https://en.wikipedia.org/w/index.php?action=raw&title=" + name.replace(" ", "_"));


            BufferedReader br = new BufferedReader(new InputStreamReader(url.openConnection().getInputStream()));

            String line = null;
            while (null != (line = br.readLine())) {
                line = line.trim();
                if (!line.startsWith("|")
                        && !line.startsWith("{")
                        && !line.startsWith("}")
                        && !line.startsWith("<center>")
                        && !line.startsWith("---")) {
                    text += line;
                }
                if (text.length() > 200) {
                    break;
                }
            }
        }
        catch(Exception ex){
            //do nothing
        }
        return text;
    }

    public static void main(String args[]){
        System.out.println("Start...");

        Extractor ex = new Extractor();
        try {
            //ex.basicReadingFile();
            //ex.basicReadingStream();
            ex.extractData("/home/antonio/Scrivania/NewDelhi/example.osm", "/home/antonio/Scrivania/NewDelhi/output.csv");
            ex.extractData("/home/antonio/Scrivania/NewDelhi/blocco1.osm");
            ex.extractData("/home/antonio/Scrivania/NewDelhi/blocco2.osm");
            ex.extractData("/home/antonio/Scrivania/NewDelhi/blocco3.osm");


        }
        catch(Exception e){
            //do nothing
        }

        System.out.println("End...");
    }
}
